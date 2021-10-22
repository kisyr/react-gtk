import omit from 'ramda/src/omit';
import { GObject, Gtk } from '../env';
import {
	connectSignal,
	blockSignalHandler,
	blockSignalHandlers,
	unblockSignalHandler,
	unblockSignalHandlers,
} from '../lib';
import Widget from './Widget';

function setTreeItems(model, items, root = null) {
	if (items && Array.isArray(items)) {
		items.forEach(item => {
			const iterator = model.append(root);
			const row = new imports.gi.GObject.Object();
			row.rowData = item;
			model.set(iterator, [0], [row]);
			if (item.children) {
				setTreeItems(model, item.children, iterator);
			}
		});
	}
}

function filterTreeItems(items, predicate, result = [], path = []) {
	if (items && Array.isArray(items)) {
		items.forEach((item, index) => {
			const childPath = [ ...path, index ];
			if (predicate(item)) {
				result.push({ item, path: childPath });
			}
			if (item.children) {
				filterTreeItems(item.children, predicate, result, childPath);
			}
		});
	}
	return result;
}

function expandTreeItems(tree, items, root = null) {
	// We need to find any 'expanded' items in the nested items
	// and at the same time save the path indices. We can then
	// iterate over the resulting list and find leafs to expand.
	const expandedItems = filterTreeItems(items, item => item.expanded);

	// Map & sort the expanded items list DESC so we have the leafs first.
	const expandedPaths = expandedItems.map(item => item.path.join(':')).sort().reverse();

	// Now reduce the list and remove previous paths.
	const expandedLeafPaths = expandedPaths.reduce((result, path) => {
		if (!result.find(p => path.indexOf(p) != -1)) {
			result.push(path);
		}
		return result;
	}, []);

	// Expand the paths
	expandedLeafPaths.forEach(path => {
		const treePath = Gtk.TreePath.new_from_string(path);
		const result = tree.expand_to_path(treePath);
	});
}

function createTreeModel(items) {
	const model = new Gtk.TreeStore();
	model.set_column_types([ GObject.TYPE_OBJECT ]);
	setTreeItems(model, items);
	return model;
}

export default class TreeView extends Widget {
	get type() {
		return Gtk.TreeView;
	}

	parseProps(props) {
		return props.map(([ prop, value ]) => {
			if (prop === 'onRowSelected') {
				if (!this.instance) {
					return null;
				}

				const selection = this.instance.get_selection();
				// Using this helper we disconnect any already connected handlers
				// to avoid duplicates.
				connectSignal(selection, 'onChanged', () => {
					const [ selected, model, iterator ] = selection.get_selected();
					const row = model.get_value(iterator, 0);
					const path = model.get_path(iterator);
					value(row.rowData, path.to_string());
				});

				return null;
			}

			if (prop === 'treeStore') {
				// If instance is null we're assuming constructor, and Gtk.TreeView
				// requires a valid model here.
				if (!this.instance) {
					const model = createTreeModel(value);

					return [ 'model', model ];
				}

				const model = this.instance.get_model();
				const selection = this.instance.get_selection();
				// Block all our signal handlers for this because this reset
				// triggers selection:changed, treeview:row-collapsed, and
				// treeview::row-expanded.
				if (selection) {
					//blockSignalHandler(selection, 'onChanged');
				}
				blockSignalHandlers(this.instance);

				model.clear();
				setTreeItems(model, value);
				expandTreeItems(this.instance, value);

				unblockSignalHandlers(this.instance);
				if (selection) {
					//unblockSignalHandler(selection, 'onChanged');
				}

				return null;
			}

			if (prop === 'onRowExpanded' || prop === 'onRowCollapsed') {
				if (!this.instance) {
					return null;
				}

				const newValue = (instance, iterator, path) => {
					const model = instance.model;
					const row = model.get_value(iterator, 0);
					value(row.rowData, path.to_string());
				};

				return [ prop, newValue ];
			}

			return [ prop, value ];
		}).filter(set => set !== null);
	}

	createInstance(props) {
		super.createInstance(props);

		const treeStoreProp = props.find(([ prop ]) => prop === 'treeStore');

		if (treeStoreProp) {
			expandTreeItems(this.instance, treeStoreProp[1]);
		}
	}

	appendChild(child) {
		if (
			!this.hasChild(child) &&
			child.instance instanceof Gtk.TreeViewColumn
		) {
			this.instance.append_column(child.instance);
		}
	}
}

