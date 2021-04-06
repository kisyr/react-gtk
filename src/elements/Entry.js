import { Gtk } from '../env';
import ControlledWidget from './ControlledWidget';

export default class Entry extends ControlledWidget {
	get type() {
		return Gtk.Entry;
	}

	get controls() {
		return [ 'text' ];
	}
};

