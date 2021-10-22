import omit from 'ramda/src/omit';
import { Gtk } from '../env';
import Widget from './Widget';

export default class CellRendererText extends Widget {
	get type() {
		return Gtk.CellRendererText;
	}

	parseProps(props) {
		return props
			.filter(([ prop ]) => prop !== 'dataFunc');
	}

	createInstance(props) {
		super.createInstance(props);

		this.dataFunc = (column, cell, model, iterator) => {
			const [ prop, dataFunc ] = props.find(([ prop ]) => prop === 'dataFunc');
			if (dataFunc) {
				const row = model.get_value(iterator, 0);
				const data = dataFunc(row.rowData);
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

