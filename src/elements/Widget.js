import { Gtk } from '../env';
import {
	updateInstanceProps,
	updateInstanceSignals,
	rewriteSignalHandler,
	isProp,
	isSignal,
} from '../lib';

export default class Widget {
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

		this.instance = new this.type(appliedProps);

		// Set the signal handlers with our mapped names (kebabs).
		// TODO: Can we refactor this by just triggering an update like
		// we do below with controlled handlers?
		updateInstanceSignals(this.instance, {
			unset: [],
			set: Object.entries(props).filter(([ prop ]) => isSignal(this.type, prop)),
		});

		// Set any controlled props and signal handlers.
		const controlledSet = this.controls.reduce((result, scheme) => {
			const [ schemeProp, schemeHandler ] = scheme;
			return [
				...result,
				[ schemeProp, props[schemeProp] ],
				[ schemeHandler, props[schemeHandler] || (() => {}) ],
			];
		}, []);

		this.update({ unset: [], set: controlledSet });
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
		// Create rewritten signal handlers so that we can trigger handler
		// with a new value.
		// Is this actually necessary other than doing complex handler logic?
		const controlledHandlerSet = this.controls.map(scheme => {
			const [ schemeProp, schemeHandler ] = scheme;
			const valueSet = changes.set.find(([ prop ]) => prop === schemeProp);
			const handlerSet = changes.set.find(([ prop ]) => prop === schemeHandler);
			const overwrittenHandler = (...args) => {
				const newValue = this.instance[schemeProp];
				if (handlerSet) {
					handlerSet[1](newValue);
				}
			};

			return [ schemeHandler, overwrittenHandler ];
		});

		// Trigger an update with controlled values removed and controlled handlers
		// overwritten.
		const controlledValueProps = this.controls.map(scheme => scheme[0]);
		const controlledHandlerProps = controlledHandlerSet.map(([ prop ]) => prop);

		const appliedSet = changes.set
			.filter(([ prop ]) => !controlledValueProps.includes(prop))
			.filter(([ prop ]) => !controlledHandlerProps.includes(prop))
			.concat(controlledHandlerSet);

		updateInstanceProps(this.instance, {
			unset: changes.unset.filter(prop => isProp(this.type, prop)),
			set: appliedSet.filter(([ prop ]) => isProp(this.type, prop)),
		});
		updateInstanceSignals(this.instance, {
			unset: changes.unset.filter(prop => isSignal(this.type, prop)),
			set: appliedSet.filter(([ prop ]) => isSignal(this.type, prop)),
		});

		// Update the controlled values for instance. For this we need to
		// block their change signals so we don't enter a feedback loop
		// as updating the instance value would trigger a signal handler
		// which would maybe trigger an update from React component...
		this.controls.forEach(scheme => {
			const [ schemeProp, schemeHandler ] = scheme;
			const valueSet = changes.set.find(([ prop ]) => prop === schemeProp);
			if (valueSet) {
				const rewrittenUpdate = rewriteSignalHandler(this.instance, [ schemeHandler ], () => {
					this.instance[schemeProp] = valueSet[1];
				});
				rewrittenUpdate();
			}
		});
	}
/*
	update(changes) {
		updateInstanceProps(this.instance, {
			unset: changes.unset.filter(prop => isProp(this.type, prop)),
			set: changes.set.filter(([ prop ]) => isProp(this.type, prop)),
		});

		updateInstanceSignals(this.instance, {
			unset: changes.unset.filter(prop => isSignal(this.type, prop)),
			set: changes.set.filter(([ prop ]) => isSignal(this.type, prop)),
		});
	}
*/
}

