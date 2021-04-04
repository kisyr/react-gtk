import clone from 'ramda/src/clone';
import { Gtk, GdkPixbuf } from '../env';
import Widget from './Widget';

function createPixbuf(pixbuf) {
	return GdkPixbuf.Pixbuf.new_from_file_at_scale(
		pixbuf.filename,
		pixbuf.width,
		pixbuf.height,
		pixbuf.preserveAspectRatio
	);
}

export default class Image extends Widget {
	get type() {
		return Gtk.Image;
	}

	constructor(props) {
		const appliedProps = clone(props);

		if (appliedProps.pixbuf) {
			appliedProps.pixbuf = createPixbuf(props.pixbuf);
			delete appliedProps.file;
		}

		super(appliedProps);
	}

	update(changes) {
		const appliedSet = clone(changes.set);

		const pixbufSet = appliedSet.find(([ prop ]) => prop === 'pixbuf');

		if (pixbufSet) {
			pixbufSet[1] = createPixbuf(pixbufSet[1]);
		}

		super.update({ ...changes, set: appliedSet });
	}
}

