import { Gtk } from '../env';
import { createWidget } from '../lib';

const HeaderBar = (props) => createWidget(Gtk.HeaderBar, props);

export default HeaderBar;

