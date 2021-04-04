import { Gtk } from '../env';
import { createWidget } from '../lib';

const TreeViewColumn = (props) => {
	const {
		type,
		instance,
		removeChild,
	} = createWidget(Gtk.TreeViewColumn, props);

	const appliedAppendChild = (parentElement, childElement) => {
		const children = parentElement.instance.get_cells();

		if (
			!children.includes(childElement.instance) &&
			childElement.instance instanceof Gtk.CellRenderer
		) {
			parentElement.instance.pack_start(childElement.instance, true);
			parentElement.instance.set_cell_data_func(
				childElement.instance,
				(column, cell, model, iterator) => {
					childElement.dataFunc(column, cell, model, iterator);
				}
			);
		}
	};

	const appliedInsertBefore = appliedAppendChild;

	return {
		type,
		instance,
		appendChild: appliedAppendChild,
		insertBefore: appliedInsertBefore,
		removeChild,
		show: () => {},
		update: () => {},
	};
};

export default TreeViewColumn;

