import { Gtk } from '../env';
import Widget from './Widget';

export default class Frame extends Widget {
	get type() {
		return Gtk.Frame;
	}

	appendChild(child) {
		if (!this.hasChild(child)) {
			this.instance.set_child(child.instance);
		}
	}

	insertBefore(child, beforeChild) {
		return this.appendChild(child);
	}
}

