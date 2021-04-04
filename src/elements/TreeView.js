import omit from 'ramda/src/omit';
import { GObject, Gtk } from '../env';
import { createControlledWidget } from '../lib';

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

const TreeView = (props) => {
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

	const {
		type,
		instance,
		insertBefore,
		removeChild,
		show,
		update,
	} = createControlledWidget(Gtk.TreeView, appliedProps, [
		// TODO: Support custom handler callback for complex changes.
		// Also we probably need to catch a change signal before the
		// model is updated in backend so we don't need to reset it.
	]);

	const appliedAppendChild = (parentElement, childElement) => {
		const children = parentElement.instance.get_children();

		if (
			!children.includes(childElement.instance) &&
			childElement.instance instanceof Gtk.TreeViewColumn
		) {
			parentElement.instance.append_column(childElement.instance);
		}
	};

	return {
		type,
		instance,
		appendChild: appliedAppendChild,
		insertBefore,
		removeChild,
		show,
		update,
	};
};

export default TreeView;

