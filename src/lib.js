import kebabCase from 'just-kebab-case';
import { GObject } from './env';

export function getInternalSignalName(prop) {
	return prop.slice(2).split('::').map(kebabCase).join('::');
}

export function isValidSignal(type, prop) {
	if (prop.startsWith('on')) {
		const signalName = getInternalSignalName(prop);
		const signalId = GObject.signal_lookup(signalName.split('::')[0], type);
		return signalId !== 0;
	}

	return false;
}

export function disconnectSignal(instance, prop) {
	const signalName = getInternalSignalName(prop);
	if (typeof instance._connectedSignals[signalName] !== 'undefined') {
		instance.disconnect(instance._connectedSignals[signalName]);
		delete instance._connectedSignals[signalName];
	}
}

export function connectSignal(instance, prop, handler) {
	const signalName = getInternalSignalName(prop);
	disconnectSignal(instance, prop);
	instance._connectedSignals[signalName] = instance.connect(signalName, handler);
}

export function blockSignalHandler(instance, prop) {
	const signalName = getInternalSignalName(prop);
	const signalHandler = instance._connectedSignals[signalName];
	if (signalHandler) {
		GObject.signal_handler_block(instance, signalHandler);
	}
}

export function unblockSignalHandler(instance, prop) {
	const signalName = getInternalSignalName(prop);
	const signalHandler = instance._connectedSignals[signalName];
	if (GObject.signal_handler_is_connected(instance, signalHandler)) {
		GObject.signal_handler_unblock(instance, signalHandler);
	}
}

export function rewriteSignalHandler(instance, props, callback) {
	return function(...args) {
		let error = null;
		try {
			props.forEach(prop => blockSignalHandler(instance, prop));
			callback(...args);
		} catch (e) {
			error = e;
		} finally {
			props.forEach(prop => unblockSignalHandler(instance, prop));
		}
		if (error) {
			throw error;
		}
	}
}

export function updateInstanceSignals(instance, changes) {
	instance._connectedSignals = instance._connectedSignals || {};

	changes.unset.forEach(prop => disconnectSignal(instance, prop));
	changes.set.forEach(([ prop, handler ]) => connectSignal(instance, prop, handler));
}

export function updateInstanceProps(instance, changes) {
	changes.unset.forEach(prop => instance[prop] = null);
	changes.set.forEach(([ prop, value ]) => instance[prop] = value);
}

export function isProp(type, prop) {
	return !isValidSignal(type, prop);
}

export function isSignal(type, prop) {
	return isValidSignal(type, prop);
}

export function controlUpdate(element, schemes, update = () => {}) {
	// Create rewritten signal handlers so that we can trigger handler
	// with a new value.
	// Is this actually neccessary other than doing complex handler logic?
	const controlledHandlerSet = schemes.map(scheme => {
		const [ schemeProp, schemeHandler ] = scheme;
		const valueSet = changes.set.find(([ prop ]) => prop === schemeProp);
		const handlerSet = changes.set.find(([ prop ]) => prop === schemeHandler);
		const overwrittenHandler = (...args) => {
			const newValue = element.instance[schemeProp];
			if (handlerSet) {
				handlerSet[1](newValue);
			}
		};

		return [ schemeHandler, overwrittenHandler ];
	});

	// Trigger an update with controlled values removed and controlled handlers
	// overwritten.
	const controlledValueProps = schemes.map(scheme => scheme[0]);
	const controlledHandlerProps = controlledHandlerSet.map(([ prop ]) => prop);

	const appliedSet = changes.set
		.filter(([ prop ]) => !controlledValueProps.includes(prop))
		.filter(([ prop ]) => !controlledHandlerProps.includes(prop))
		.concat(controlledHandlerSet);

	update(element, { unset: changes.unset, set: appliedSet });

	// Update the controlled values for instance. For this we need to
	// block their change signals so we don't enter a feedback loop
	// as updating the instance value would trigger a signal handler
	// which would maybe trigger an update from React component...
	schemes.forEach(scheme => {
		const [ schemeProp, schemeHandler ] = scheme;
		const valueSet = changes.set.find(([ prop ]) => prop === schemeProp);
		if (valueSet) {
			const rewrittenUpdate = rewriteSignalHandler(element.instance, [ schemeHandler ], () => {
				element.instance[schemeProp] = valueSet[1];
			});
			rewrittenUpdate();
		}
	});
}

export function createInstance(type) {
	return { type, instance: new type() };
}

export function createWidget(type, props = {}) {
	const appliedProps = Object.fromEntries(Object.entries(props)
		.filter(([ prop ]) => isProp(type, prop))
		.filter(([ prop ]) => prop !== 'children')
	);

	const instance = new type(appliedProps);

	updateInstanceSignals(instance, {
		unset: [],
		set: Object.entries(props).filter(([ prop ]) => isSignal(type, prop)),
	});

	const appendChild = (parentElement, childElement) => {
		const children = parentElement.instance.get_children();
		if (!children.includes(childElement.instance)) {
			parentElement.instance.add(childElement.instance);
		}
	};

	const insertBefore = appendChild;

	const removeChild = (parentElement, childElement) => {
		parentElement.instance.remove(childElement.instance);
	};

	const show = (element) => {
		element.instance.show();
	};

	const update = (element, changes) => {
		updateInstanceProps(element.instance, {
			unset: changes.unset.filter(prop => isProp(element.type, prop)),
			set: changes.set.filter(([ prop ]) => isProp(element.type, prop)),
		});
		updateInstanceSignals(element.instance, {
			unset: changes.unset.filter(prop => isSignal(element.type, prop)),
			set: changes.set.filter(([ prop ]) => isSignal(element.type, prop)),
		});
	};

	return {
		type,
		instance,
		appendChild,
		insertBefore,
		removeChild,
		show,
		update,
	};
}

export function createControlledWidget(type, props = {}, schemes = []) {
	// Exclude the controlled props (value, handler) from initial ctor props
	// because we want to set overwritten signal handlers.
	// ... wait, this doesn't seem necessary because we overwrite them either way?
	/*
	const schemeProps = Object.entries(props).reduce((result, scheme) => {
		return [ ...result, scheme[0], scheme[2] ];
	}, []);
	const appliedProps = Object.fromEntries(Object.entries(props)
		.filter(([ prop ]) => !schemeProps.includes(prop))
	);
	*/

	const {
		instance,
		appendChild,
		insertBefore,
		removeChild,
		show,
		update,
	} = createWidget(type, props);

	// Apply control over the update.
	const appliedUpdate = (element, changes) => {
		// Create rewritten signal handlers so that we can trigger handler
		// with a new value.
		// Is this actually necessary other than doing complex handler logic?
		const controlledHandlerSet = schemes.map(scheme => {
			const [ schemeProp, schemeHandler ] = scheme;
			const valueSet = changes.set.find(([ prop ]) => prop === schemeProp);
			const handlerSet = changes.set.find(([ prop ]) => prop === schemeHandler);
			const overwrittenHandler = (...args) => {
				const newValue = element.instance[schemeProp];
				if (handlerSet) {
					handlerSet[1](newValue);
				}
			};

			return [ schemeHandler, overwrittenHandler ];
		});

		// Trigger an update with controlled values removed and controlled handlers
		// overwritten.
		const controlledValueProps = schemes.map(scheme => scheme[0]);
		const controlledHandlerProps = controlledHandlerSet.map(([ prop ]) => prop);

		const appliedSet = changes.set
			.filter(([ prop ]) => !controlledValueProps.includes(prop))
			.filter(([ prop ]) => !controlledHandlerProps.includes(prop))
			.concat(controlledHandlerSet);

		update(element, { unset: changes.unset, set: appliedSet });

		// Update the controlled values for instance. For this we need to
		// block their change signals so we don't enter a feedback loop
		// as updating the instance value would trigger a signal handler
		// which would maybe trigger an update from React component...
		schemes.forEach(scheme => {
			const [ schemeProp, schemeHandler ] = scheme;
			const valueSet = changes.set.find(([ prop ]) => prop === schemeProp);
			if (valueSet) {
				const rewrittenUpdate = rewriteSignalHandler(element.instance, [ schemeHandler ], () => {
					element.instance[schemeProp] = valueSet[1];
				});
				rewrittenUpdate();
			}
		});
	};

	// Trigger an update to initially set overwritten signal handlers.
	const appliedSet = schemes.reduce((result, scheme) => {
		const [ schemeProp, schemeHandler ] = scheme;
		return [
			...result,
			[ schemeProp, props[schemeProp] ],
			[ schemeHandler, props[schemeHandler] || (() => {}) ],
		];
	}, []);

	appliedUpdate({ type, instance }, { unset: [], set: appliedSet });

	return {
		type,
		instance,
		appendChild,
		insertBefore,
		removeChild,
		show,
		update: appliedUpdate,
	};
};

