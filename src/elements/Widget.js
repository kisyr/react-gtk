import { Gtk } from '../env';
import { createWidget } from '../lib';

const Widget = (props) => createWidget(Gtk.Widget, props);

export default Widget;

