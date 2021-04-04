import { Gtk } from '../env';
import Widget from './Widget';

export default class Label extends Widget {
	get type() {
		return Gtk.Label;
	}
}

