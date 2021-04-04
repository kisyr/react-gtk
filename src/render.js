import ReactReconciler from 'react-reconciler';
import hostConfig from './hostConfig.js';
import { Gtk } from './env';

export function render(element, container) {
	const roots = new Map();
	const reconciler = new ReactReconciler(hostConfig);

	let root = roots.get(container);

	if (!root) {
		print('render::createContainer', container);
		root = reconciler.createContainer(container);
		roots.set(container, root);
	}

	print('render::updateContainer', element, container);
	reconciler.updateContainer(element, root, null, () => {});

	return reconciler.getPublicRootInstance(root);
}

export function createApp(element) {
	print('createApp::init');
	Gtk.init(null);

	print('createApp::application');
	const app = new Gtk.Application();

	print('createApp::connect');
	app.connect('activate', () => render(element, app));

	return app;
}

