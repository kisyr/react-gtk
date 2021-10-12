import { Gtk } from '../env';
import Widget from './Widget';

export default class MenuButton extends Widget {
	get type() {
		return Gtk.MenuButton;
	}

	appendChild(child) {
		if (!this.hasChild(child) && child.instance instanceof Gtk.Popover) {
			this.instance.set_popover(child.instance);
		}
	}

	insertBefore(child, beforeChild) {
		return this.appendChild(child);
	}
}

