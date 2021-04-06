import { Gtk } from '../env';
import Widget from './Widget';

export default class EventBox extends Widget {
	get type() {
		return Gtk.EventBox;
	}
}

