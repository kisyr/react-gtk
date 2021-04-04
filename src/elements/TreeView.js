import omit from 'ramda/src/omit';
import { GObject, Gtk } from '../env';
import Widget from './Widget';

function modelAppend(model, items, root = null) {
	if (items && Array.isArray(items)) {
		items.forEach(item => {
			const iterator = model.append(root);
			const row = new imports.gi.GObject.Object();
			row.rowData = item;
			model.set(iterator, [0], [row]);
			if (item.children) {
				modelAppend(model, item.children, iterator);
			}
		});
	}
}

export default class TreeView extends Widget {
	get type() {
		return Gtk.TreeView;
	}

	constructor(props) {
		const model = new Gtk.TreeStore();
		model.set_column_types([ GObject.TYPE_OBJECT ]);
		modelAppend(model, props.treeStore);

		const appliedProps = {
			...omit([
				'treeStore',
				'onRowExpanded',
				'onRowCollapsed',
				'onRowSelected',
			], props),
			model,
		};

		super(appliedProps);
	}

	appendChild(child) {
		const children = this.instance.get_children();

		if (
			!children.includes(child.instance) &&
			child.instance instanceof Gtk.TreeViewColumn
		) {
			this.instance.append_column(child.instance);
		}
	}
}

