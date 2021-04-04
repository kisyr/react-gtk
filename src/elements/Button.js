import { Gtk } from '../env';
import Widget from './Widget';

export default class Button extends Widget {
	get type() {
		return Gtk.Button;
	}
}

