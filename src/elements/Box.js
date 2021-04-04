import { Gtk } from '../env';
import Widget from './Widget';

export default class Box extends Widget {
	get type() {
		return Gtk.Box;
	}
}

