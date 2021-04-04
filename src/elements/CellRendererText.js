import omit from 'ramda/src/omit';
import { Gtk } from '../env';
import { createWidget } from '../lib';

const CellRendererText = (props) => {
	const appliedProps = omit([ 'dataFunc' ], props);

	const {
		type,
		instance,
	} = createWidget(Gtk.CellRendererText, appliedProps);

	const dataFunc = (column, cell, model, iterator) => {
		if (props.dataFunc) {
			const row = model.get_value(iterator, 0);
			const data = props.dataFunc(row.rowData);
			cell.text = String(data);
		}
	};

	return {
		type,
		instance,
		appendChild: () => {},
		insertBefore: () => {},
		removeChild: () => {},
		show: () => {},
		update: () => {},
		dataFunc,
	};
};

export default CellRendererText;

