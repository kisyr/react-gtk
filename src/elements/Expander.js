import { Gtk } from '../env';
import ControlledWidget from './ControlledWidget';

export default class Expander extends ControlledWidget {
	get type() {
		return Gtk.Expander;
	}

	get controls() {
		// TODO: This is still fucking broken and fuck GTK and their inconsistent signals.
		// When the fucking 'activate' signal runs and we reset it's value, it still 
		// overwrites the 'expanded' property afterwards like delayed magic.
		//
		// The "activate" signal can also be used to track the expansion though it occurs
		// before the "expanded" property is changed so the logic of the expander_callback()
		// function would have to be reversed.

		return [ 'expanded' ];
	}
}

