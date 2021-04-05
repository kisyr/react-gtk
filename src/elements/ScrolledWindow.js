import { Gtk } from '../env';
import Widget from './Widget';

export default class ScrolledWindow extends Widget {
	get type() {
		return Gtk.ScrolledWindow;
	}
}

