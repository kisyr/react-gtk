import clone from 'ramda/src/clone';
import { Gtk, GdkPixbuf } from '../env';
import { createWidget } from '../lib';

function createPixbuf(pixbuf) {
	return GdkPixbuf.Pixbuf.new_from_file_at_scale(
		pixbuf.filename,
		pixbuf.width,
		pixbuf.height,
		pixbuf.preserveAspectRatio
	);
}

const Image = (props) => {
	const appliedProps = clone(props);

	if (appliedProps.pixbuf) {
		appliedProps.pixbuf = createPixbuf(props.pixbuf);
		delete appliedProps.file;
	}

	const {
		type,
		instance,
		appendChild,
		insertBefore,
		removeChild,
		show,
		update,
	} = createWidget(Gtk.Image, appliedProps);

	const appliedUpdate = (element, changes) => {
		let appliedSet = clone(changes.set);

		const pixbufSet = appliedSet.find(([ prop ]) => prop === 'pixbuf');

		if (pixbufSet) {
			pixbufSet[1] = createPixbuf(pixbufSet[1]);
		}

		update(element, { ...changes, set: appliedSet });
	};

	return {
		type,
		instance,
		appendChild,
		insertBefore,
		removeChild,
		show,
		update: appliedUpdate,
	};
};

export default Image;

