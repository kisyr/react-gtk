import ReactReconciler from 'react-reconciler';
import hostConfig from './hostConfig.js';
import { Gtk } from './env';

export function render(element, container) {
	const roots = new Map();
	const reconciler = new ReactReconciler(hostConfig);

	let root = roots.get(container);

	if (!root) {
		root = reconciler.createContainer(container);
		roots.set(container, root);
	}

	reconciler.updateContainer(element, root, null, () => {});

	return reconciler.getPublicRootInstance(root);
}

export function createApp(element) {
	Gtk.init();

	const app = new Gtk.Application();

	app.connect('activate', () => render(element, app));

	return app;
}

