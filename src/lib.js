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

