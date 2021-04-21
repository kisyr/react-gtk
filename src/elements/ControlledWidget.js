import { Gtk } from '../env';
import { updateInstanceProps, isProp } from '../lib';
import Widget from './Widget';

export default class ControlledWidget extends Widget {
	get controls() {
		return [];
	}

	constructor(props) {
		super({});

		// Trigger an update to initialize controlled handlers.
		const appliedSet = Object.entries(props)
			.filter(([ prop ]) => prop !== 'children');

		this.update({ unset: [], set: appliedSet });
	}

	update(changes) {
		const getControlledHandlerName = (prop) => {
			const ucfirst = prop.charAt(0).toUpperCase() + prop.slice(1);
			return `onChange${ucfirst}`;
		};

		// Find out which props we can control based on this.controls and set props.
		// [ [ 'text', 'abc123', 'onChangeText', function ], ... ]
		// TODO: Refactor
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
					: (() => { log('-- default handler --'); });
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
				controlledValue,
				controlledHandlerName,
				controlledHandler,
			] = control;

			const wrapper = () => {
				const newValue = this.instance[controlledProp];
				const oldValue = controlledValue;

				log(`notify::${controlledProp}`, newValue, oldValue);

				// Extra security to skip feedback loop. We actually already 
				// avoid this by blocking *all* connected signals on instance
				// inside updateInstanceProps when resetting below.
				if (newValue == oldValue) {
					return;
				}

				// Reset the instance prop value because this is controlled.
				// This is done with blocking *all* connected signals inside
				// updateInstanceProps.
				updateInstanceProps(this.instance, {
					unset: [],
					set: [[ controlledProp, oldValue ]],
				});

				if (controlledHandler) {
					controlledHandler(newValue);
				}
			};

			return [ `onNotify::${controlledProp}`, wrapper ];
		}, []);

		// Replace any controlled handlers in the change set
		const appliedSet = changes.set
			.filter(([ prop ]) => !validControlledProps.find(control => control[2] === prop))
			.concat(controlledHandlerSet);

		super.update({ ...changes, set: appliedSet });
	}
}

