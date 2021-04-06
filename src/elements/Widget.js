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

		// Trigger an update to initially set any signal handlers. This will
		// also set value props but that shouldn't matter.
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
		print('-- update --', stringify(changes));
		// FIXME: Bug! Right now we are setting the controlled handlers on each
		// update even when the changes don't include it. That means that a change
		// of 'prepareUpdate {"text":""} {"text":""} true' would trigger this but
		// the actual changes object doesn't include the non-diff "text". The
		// handler would be updated but the below logic can't find the "text"
		// so it doesn't think it's controlled anymore, so no resetting it in
		// the overwritten handler!
		// Why does the reconciler think that it needs update when it isn't changed?
		// prepareUpdate {"text":""} {"text":""} true
		// -- ["text","onChanged","children"] ["text","onChanged","children"]
		// Seems when the component including the widget updates, it's hook 
		// function updates signature and diffs, which triggers the update.
		// We need to handle that and still know if there was an old value bound.
		this.controlledValues = this.controlledValues || {};

		// Create rewritten signal handlers so that we can trigger handler
		// with a new value.
		// Is this actually necessary other than doing complex handler logic?
		const controlledHandlerSet = this.controls.map(scheme => {
			const [ schemeProp, schemeHandler ] = scheme;
			const valueSet = changes.set.find(([ prop ]) => prop === schemeProp);
			const handlerSet = changes.set.find(([ prop ]) => prop === schemeHandler);
			// Test storing the current controlled value in case it's lost in
			// future updates/diffs.This seems to work but maybe can refactor?
			if (valueSet) {
				this.controlledValues[schemeProp] = valueSet[1];
			}
			const overwrittenHandler = (...args) => {
				const newValue = this.instance[schemeProp];
				print('-- overwrittenHandler --', stringify({ scheme, handlerSet, valueSet }));
				print('-- controlledValues --', stringify(this.controlledValues));
				if (this.controlledValues.hasOwnProperty(schemeProp)) {
					const blockedUpdate = rewriteSignalHandler(this.instance, [ schemeHandler ], () => {
						this.instance[schemeProp] = this.controlledValues[schemeProp];
					});
					blockedUpdate();
				}
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

		print('-- appliedSet --', stringify(appliedSet));

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

