import { Gtk } from '../env';
import Widget from './Widget';

export default class TreeViewColumn extends Widget {
	get type() {
		return Gtk.TreeViewColumn;
	}

	appendChild(child) {
		const children = this.instance.get_cells();

		if (
			!children.includes(child.instance) &&
			child.instance instanceof Gtk.CellRenderer
		) {
			this.instance.pack_start(child.instance, true);
			this.instance.set_cell_data_func(
				child.instance,
				(column, cell, model, iterator) => {
					child.dataFunc(column, cell, model, iterator);
				}
			);
		}
	}

	show() {}

	update(changes) {}
}

