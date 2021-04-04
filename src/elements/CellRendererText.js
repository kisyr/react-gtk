import omit from 'ramda/src/omit';
import { Gtk } from '../env';
import Widget from './Widget';

export default class CellRendererText extends Widget {
	get type() {
		return Gtk.CellRendererText;
	}

	constructor(props) {
		const appliedProps = omit([ 'dataFunc' ], props);

		super(appliedProps);

		this.dataFunc = (column, cell, model, iterator) => {
			if (props.dataFunc) {
				const row = model.get_value(iterator, 0);
				const data = props.dataFunc(row.rowData);
				cell.text = String(data);
			}
		};
	}

	appendChild(child) {}

	insertBefore(child, beforeChild) {}

	removeChild(child) {}

	show() {}

	update(changes) {}
}

