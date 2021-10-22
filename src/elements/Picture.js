import clone from 'ramda/src/clone';
import { Gio, Gtk } from '../env';
import Widget from './Widget';

export default class Picture extends Widget {
	get type() {
		return Gtk.Picture;
	}

	parseProps(props) {
		return props.map(([ prop, value ]) => {
			if (prop === 'file' && typeof value === 'string') {
				value = Gio.File.new_for_path(value);
			}

			return [ prop, value ];
		}).filter(set => set !== null);
	}
}

