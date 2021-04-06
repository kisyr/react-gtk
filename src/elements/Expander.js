import { Gtk } from '../env';
import ControlledWidget from './ControlledWidget';

export default class Expander extends ControlledWidget {
	get type() {
		return Gtk.Expander;
	}

	get controls() {
		return [ 'expanded' ];
	}
}

