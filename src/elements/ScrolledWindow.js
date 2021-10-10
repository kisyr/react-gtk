import { Gtk } from '../env';
import Widget from './Widget';

export default class ScrolledWindow extends Widget {
	get type() {
		return Gtk.ScrolledWindow;
	}

	appendChild(child) {
		if (!this.hasChild(child)) {
			this.instance.set_child(child.instance);
		}
	}
}

