import { Gtk } from '../env';
import Widget from './Widget';

export default class Spinner extends Widget {
	get type() {
		return Gtk.Spinner;
	}
}

