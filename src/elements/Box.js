import { Gtk } from '../env';
import Widget from './Widget';

export default class Box extends Widget {
	get type() {
		return Gtk.Box;
	}

	appendChild(child) {
		if (child.instance instanceof Gtk.GestureClick) {
			return this.instance.add_controller(child.instance);
		}

		this.instance.append(child.instance);
	}
}

