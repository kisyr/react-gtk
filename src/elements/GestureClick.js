import { Gtk } from '../env';
import Widget from './Widget';

export default class GestureClick extends Widget {
	get type() {
		return Gtk.GestureClick;
	}

	appendChild(child) {}

	removeChild(child) {}

	show() {}

	getChildren() { return []; }

	hasChild(child) { return false; }
}

