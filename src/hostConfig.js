const R = require('ramda');
const withoutChildren = R.omit([ 'children' ]);
import { Gtk } from './env';
import publicElements from './elements';

const stringify = JSON.stringify;
const log = print;

export default {
	now: Date.now,

	useSyncScheduling: true,

	supportsMutation: true,

	createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
		log('createInstance', type, props);

		const Type = publicElements[type];

		if (!Type) {
			throw new Error(`Unknown component: ${type}`);
		}

		return Type(props, rootContainerInstance, hostContext, internalInstanceHandle);
	},

	createTextInstance(
		text,
		rootContainerInstance,
		hostContext,
		internalInstanceHandle
	) {
		log('createTextInstance');

		throw new Error('ReactGTK does not support text instances. Use gtk-label to display text');
	},

	appendInitialChild(parentInstance, child) {
		log('appendInitialChild', parentInstance, child);

		child.show(child);

		if (!R.is(Gtk.Application, parentInstance)) {
			parentInstance.appendChild(parentInstance, child);
		}
	},

	finalizeInitialChildren(instance, type, props, rootContainerInstance) {
		log('finalizeInitialChildren');

		return false;
	},

	getPublicInstance(instance) {
		log('getPublicInstance');

		return instance;
	},

	prepareForCommit() {
		log('prepareForCommit');

		// If we don't return null here, doesFiberContain crashes on undefined node
		return null;
	},

	prepareUpdate(
		instance,
		type,
		oldProps,
		newProps,
		rootContainerInstance,
		hostContext
	) {
		const oldNoChildren = withoutChildren(oldProps);
		const newNoChildren = withoutChildren(newProps);
		const propsAreEqual = R.equals(oldNoChildren, newNoChildren);
		const unset = R.without(R.keys(newNoChildren), R.keys(oldNoChildren));
		const set = R.reject(R.contains(R.__, R.toPairs(oldNoChildren)), R.toPairs(newNoChildren));

		log('prepareUpdate', stringify(oldNoChildren), stringify(newNoChildren), !propsAreEqual);

		return propsAreEqual ? null : { unset, set };
	},

	resetAfterCommit() {
		log('resetAfterCommit');
	},

	resetTextContent(instance) {
		log('resetTextContent');
	},

	shouldDeprioritizeSubtree(type, props) {
		return false;
	},

	getRootHostContext(rootContainerInstance) {
		return {};
	},

	getChildHostContext(parentHostContext, type) {
		return parentHostContext;
	},

	shouldSetTextContent(props) {
		return false;
	},

	scheduleAnimationCallback() {
		log('scheduleAnimationCallback');
	},

	scheduleDeferredCallback() {
		log('scheduleDeferredCallback');
	},

	// Mutation
	appendChild(parentInstance, child) {
		log('appendChild', parentInstance, child);

		child.show(child);
		if (!R.is(Gtk.Application, parentInstance)) {
			parentInstance.appendChild(parentInstance, child);
		}
	},

	appendChildToContainer(parentInstance, child) {
		log('appendChildToContainer', parentInstance, child);

		child.show(child);
		if (!R.is(Gtk.Application, parentInstance)) {
			parentInstance.appendChild(parentInstance, child);
		}
	},

	insertBefore(parentInstance, child, beforeChild) {
		log('insertInContainerBefore', parentInstance, child, beforeChild);

		child.show(child);
		if (!R.is(Gtk.Application, parentInstance)) {
			parentInstance.insertBefore(parentInstance, child, beforeChild);
		}
	},

	insertInContainerBefore(parentInstance, child, beforeChild) {
		log('insertInContainerBefore', parentInstance, child, beforeChild);

		child.show(child);
		if (!R.is(Gtk.Application, parentInstance)) {
			parentInstance.insertBefore(parentInstance, child, beforeChild);
		}
	},

	removeChild(parentInstance, child) {
		log('removeChild', parentInstance, child);

		if (!R.is(Gtk.Application, parentInstance)) {
			parentInstance.removeChild(parentInstance, child);
		}
	},

	removeChildFromContainer(parentInstance, child) {
		log('removeChildFromContainer', parentInstance, child);

		if (!R.is(Gtk.Application, parentInstance)) {
			parentInstance.removeChild(parentInstance, child);
		}
	},

	clearContainer(parentInstance) {
		log('clearContainer');
	},

	commitTextUpdate(
		textInstance,
		oldText,
		newText
	) {
		log('commitTextUpdate');

		throw new Error('commitTextUpdate should not be called');
	},

	// commitMount is called after initializeFinalChildren *if*
	// `initializeFinalChildren` returns true.

	commitMount(
		instance,
		type,
		newProps,
		internalInstanceHandle
	) {
		log('commitMount');
	},

	commitUpdate(
		instance,
		changes,
		type,
		oldProps,
		newProps,
		internalInstanceHandle
	) {
		log('commitUpdate', stringify(changes));

		instance.update(instance, changes);
	}
};

