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
		const children = this.instance.get_children();

		if (
			!children.includes(child.instance) &&
			child.instance instanceof Gtk.HeaderBar
		) {
			this.instance.set_titlebar(child.instance);
			return;
		}

		super.appendChild(child);
	}

	removeChild(child) {
		if (child.instance instanceof Gtk.HeaderBar) {
			this.instance.set_titlebar(null);
			return;
		}

		super.removeChild(child);
	}
}

