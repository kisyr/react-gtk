import { Gtk } from '../env';
import { createWidget } from '../lib';

const Box = (props) => createWidget(Gtk.Box, props);

export default Box;

