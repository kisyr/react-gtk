import { Gtk } from '../env';
import {
	updateInstanceProps,
	updateInstanceSignals,
	rewriteSignalHandler,
	isProp,
	isSignal,
} from '../lib';

export default class ControlledWidget {
	get type() {
		return Gtk.Widget;
	}

	get controls() {
		return [];
	}

	constructor(props) {
		// Create an instance with props without children and no signals.
		const appliedProps = Object.fromEntries(Object.entries(props)
			.filter(([ prop ]) => isProp(this.type, prop))
			.filter(([ prop ]) => prop !== 'children')
		);

		print('---- ControlledWidget::constructor ----', stringify(appliedProps));

		this.instance = new this.type();

		// Trigger an update to initialize controlled handlers.
		const appliedSet = Object.entries(props)
			.filter(([ prop ]) => prop !== 'children');

		this.update({ unset: [], set: appliedSet });
	}

	appendChild(child) {
		const children = this.instance.get_children();

		if (!children.includes(child.instance)) {
			this.instance.add(child.instance);
		}
	}

	insertBefore(child, beforeChild) {
		return this.appendChild(child);
	}

	removeChild(child) {
		this.instance.remove(child.instance);
	}

	show() {
		this.instance.show();
	}

	update(changes) {
		// FIXME: YAY THIS SEEMS TO WORK PRETTY GOOD WHEN BLOCKING *ALL* HANDLERS
		// ON updateInstanceProps!!!!!!!
		// BUT there seems to be some small issue with initial/current controlled
		// value because toggling noop uses the last value after toggle.
		// We can fix this shit.
		// Before component update, appliedSet gets onNotify::expanded, but after
		// component update it gets onChangeExpanded.
		print('---- ControlledWidget::update ----', stringify(changes));

		const getControlledHandlerName = (prop) => {
			const ucfirst = prop.charAt(0).toUpperCase() + prop.slice(1);
			return `onChange${ucfirst}`;
		};

		// Find out which props we can control based on this.controls and set props.
		// [ [ 'text', 'abc123', 'onChangeText', function ], ... ]
		const validControlledProps = this.controls.reduce((result, controlledProp) => {
			const valueSet = changes.set.find(([ prop ]) => prop === controlledProp);
			this.controlledValueProps = this.controlledValueProps || {};
			if (valueSet) {
				this.controlledValueProps[valueSet[0]] = valueSet[1];
			}
			if (this.controlledValueProps.hasOwnProperty(controlledProp)) {
				const controlledValue = this.controlledValueProps[controlledProp];
				const controlledHandlerName = getControlledHandlerName(controlledProp);
				const handlerSet = changes.set.find(([ prop ]) => prop === controlledHandlerName);
				const controlledHandler = handlerSet
					? handlerSet[1]
					: (() => { print('-- default handler --'); });
				result.push([
					controlledProp,
					controlledValue,
					controlledHandlerName,
					controlledHandler,
				]);
			}
			return result;
		}, []);

		// Create updated handler sets for controlled properties. This is so 
		// we can reset the instance property value to latest prop value in the
		// controlled handler.
		const controlledHandlerSet = validControlledProps.map(control => {
			// Connect a wrapping handler for the controlled prop that observes
			// changes, resets the instance value and callbacks prop handler.
			const [
				controlledProp,
				currentValue,
				controlledHandlerName,
				controlledHandler,
			] = control;

			const wrapper = () => {
				const newValue = this.instance[controlledProp];
				const oldValue = currentValue;

				print(`notify::${controlledProp}`, newValue, oldValue);
				print('-- control --', stringify(control));

				if (newValue == oldValue) {
					print('-- skip --');
					return;
				}

				print('-- begin reset --', oldValue);
				//this.instance[controlledProp] = oldValue;
				updateInstanceProps(this.instance, {
					unset: [],
					set: [[ controlledProp, oldValue ]],
				});
				print('-- end reset --');

				if (controlledHandler) {
					print('-- begin call --', controlledHandlerName, newValue);
					controlledHandler(newValue);
					print('-- end call --');
				}
			};

			return [ `onNotify::${controlledProp}`, wrapper ];
		}, []);

		// Replace any controlled handlers in the change set
		const appliedSet = changes.set
			.filter(([ prop ]) => !validControlledProps.find(control => control[2] === prop))
			.concat(controlledHandlerSet);

		print('---- appliedSet ----', stringify(appliedSet));
		print('---- validControlledProps ----', stringify(validControlledProps));

		// Updating instance props are going to trigger 'notify' signals
		// and we cannot block them in any way I know. Our 'notify' handlers
		// are gonna compare old & new value though to avoid feedback loops.
		updateInstanceProps(this.instance, {
			unset: changes.unset.filter(prop => isProp(this.type, prop)),
			set: appliedSet.filter(([ prop ]) => isProp(this.type, prop)),
		});
		updateInstanceSignals(this.instance, {
			unset: changes.unset.filter(prop => isSignal(this.type, prop)),
			set: appliedSet.filter(([ prop ]) => isSignal(this.type, prop)),
		});
	}
}

