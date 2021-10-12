import { Gtk } from '../env';
import Widget from './Widget';

export default class Popover extends Widget {
	get type() {
		return Gtk.Popover;
	}

	appendChild(child) {
		if (!this.hasChild(child)) {
			this.instance.set_child(child.instance);
		}
	}

	insertBefore(child, beforeChild) {
		return this.appendChild(child);
	}

	show() {
		// Popovers show() themselves. Actually triggering
		// show() here would cause a critical GTK error.
	}
}

