import { Gtk } from '../env';
import Widget from './Widget';

export default class HeaderBar extends Widget {
	get type() {
		return Gtk.HeaderBar;
	}
}

