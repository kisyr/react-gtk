import { Gtk } from '../env';
import { createWidget } from '../lib';

const Button = (props) => createWidget(Gtk.Button, props);

export default Button;

