import { Gtk } from '../env';
import Widget from './Widget';

export default class FlowBox extends Widget {
	get type() {
		return Gtk.FlowBox;
	}
}

