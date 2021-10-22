import clone from 'ramda/src/clone';
import { Gtk, GdkPixbuf } from '../env';
import Widget from './Widget';

export default class Image extends Widget {
	get type() {
		return Gtk.Image;
	}

	parseProps(props) {
		return props.map(([ prop, value ]) => {
			if (prop === 'pixbuf') {
				value = GdkPixbuf.Pixbuf.new_from_file_at_scale(
					value.filename,
					value.width,
					value.height,
					value.preserveAspectRatio
				);
				// delete props.file?
			}

			return [ prop, value ];
		}).filter(set => set !== null);
	}
}

