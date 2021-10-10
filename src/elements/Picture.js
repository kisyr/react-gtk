import clone from 'ramda/src/clone';
import { Gio, Gtk } from '../env';
import Widget from './Widget';

function parseProps(set) {
	return set.map(([ prop, value ]) => {
		if (prop === 'file' && typeof value === 'string') {
			const newValue = Gio.File.new_for_path(value);

			return [ 'file', newValue ];
		}

		return [ prop, value ];
	}).filter(set => set !== null);
}

export default class Picture extends Widget {
	get type() {
		return Gtk.Picture;
	}

	constructor(props) {
		const appliedProps = Object.fromEntries(parseProps(Object.entries(clone(props))));

		super(appliedProps);
	}

	update(changes) {
		const appliedSet = parseProps(changes.set);

		super.update({ ...changes, set: appliedSet });
	}
}

