import { Gtk } from '../env';
import Widget from './Widget';

export default class Entry extends Widget {
	get type() {
		return Gtk.Entry;
	}

	get controls() {
		return [
			[ 'text', 'onChanged' ],
		];
	}
};

