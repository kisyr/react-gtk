import { Gtk } from '../env';
import { createWidget } from '../lib';

const Label = (props) => createWidget(Gtk.Label, props);

export default Label;

