import { Gtk } from '../env';
import Widget from './Widget';

export default class Window extends Widget {
	get type() {
		return Gtk.Window;
	}

	constructor(props, rootContainerInstance) {
		const appliedProps = {
			...props,
			application: rootContainerInstance,
		};

		super(appliedProps);
	}

	appendChild(child) {
		const children = this.getChildren();

		if (
			!children.includes(child.instance) &&
			child.instance instanceof Gtk.HeaderBar
		) {
			this.instance.set_titlebar(child.instance);
			return;
		}

		if (!this.hasChild(child)) {
			this.instance.set_child(child.instance);
		}
	}

	removeChild(child) {
		if (child.instance instanceof Gtk.HeaderBar) {
			this.instance.set_titlebar(null);
			return;
		}

		super.removeChild(child);
	}

	show() {
		this.instance.present();
	}
}

