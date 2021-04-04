import { Gtk } from '../env';
import { createControlledWidget } from '../lib';

const Entry = (props) => createControlledWidget(Gtk.Entry, props, [
	[ 'text', 'onChanged' ],
]);

export default Entry;

