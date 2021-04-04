import React, { useState } from 'react';
import { createApp } from '../../src/render';
import {
	Window,
	ScrolledWindow,
	Box,
	HBox,
	VBox,
	Image,
	TreeView,
	TreeViewColumn,
	CellRendererText,
} from '../../src/components';
import fs from './fs';

const R = require('ramda');

function findNode(node, path) {
	if (R.is(Array, node)) {
		return findNode({ path: '__dummy__', children: node }, path);
	}
	if (path === node.path) {
		return node;
	}
	if (node.children) {
		for (const child of node.children) {
			const found = findNode(child, path);
			if (found) {
				return found;
			}
		}
	}
	return null;
}

function fetchDirRecursive(path, maxDepth, depth = 0) {
	try {
		return fs.readdirSync(path).map(fileName => {
			const filePath = path + fileName + '/';
			const children = depth < maxDepth
				? fetchDir(filePath, maxDepth, depth + 1)
				: null;
			return {
				path: filePath,
				name: fileName,
				children: children,
				loaded: true,
			};
		});
	} catch (e) {
		return [];
	}
}

function fetchDir(path) {
	try {
		return fs.readdirSync(path).map(fileName => {
			const filePath = path + fileName + '/';
			return {
				path: filePath,
				name: fileName,
				children: [{}],
				loaded: false,
			};
		});
	} catch (e) {
		return [];
	}
}

const App = (props) => {
	const [ model, setModel ] = useState(fetchDir('/', 1));

	// TODO: Fix event handling for this - Seems broken of treeStore model clearing on updates
	const handleRowExpanded = (row, indices) => {
		console.log('handleRowExpanded', JSON.stringify(row), JSON.stringify(indices));
		if (!row.loaded) {
			const newModel = R.clone(model);
			const node = findNode(newModel, row.path);
			console.log('node', JSON.stringify(node));
			if (node) {
				node.children = fetchDir(node.path);
				node.loaded = true;
				console.log('newModel', JSON.stringify(newModel));
				setModel(newModel);
			}
		}
	};

	const handleRowSelected = (row) => {
		console.log('handleRowSelected', JSON.stringify(row));
	};

	return (
		<Window title="Counter" defaultWidth={640} defaultHeight={480}>
			<HBox>
				<TreeView
					treeStore={model}
					onRowExpanded={handleRowExpanded}
					onRowSelected={handleRowSelected}
				>
					<TreeViewColumn>
						<CellRendererText dataFunc={row => row.name || ''} />
					</TreeViewColumn>
				</TreeView>
			</HBox>
		</Window>
	);
}

createApp(<App />).run([]);
