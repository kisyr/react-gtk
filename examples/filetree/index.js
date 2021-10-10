import React, { useState, useEffect } from 'react';
import clone from 'ramda/src/clone';

import {
	createApp,
	Gtk,
	Window,
	ScrolledWindow,
	Box,
	Expander,
	Label,
	TreeView,
	TreeViewColumn,
	CellRendererText,
} from '../../src/index';

import fs from './fs';

function constructPath(base, part) {
	return `/${base}/${part}`.replace(/\/+/g, '/');
}

function getBaseName(path) {
	return path === '/'
		? path
		: path.split('/').slice(-1).pop();
}

const FileTree = (props) => {
	const [ tree, setTree ] = useState(null);

	const findNode = (node, predicate) => {
		if (predicate(node)) {
			return node;
		}
		if (node.children) {
			for (let childNode of node.children) {
				const foundNode = findNode(childNode, predicate);
				if (foundNode) {
					return foundNode;
				}
			}
		}
		return null;
	};

	const loadNode = (node) => {
		const info = fs.statSync(node.path);
		let children = null;
		if (info.isDirectory()) {
			children = fs.readdirSync(node.path).sort().map(file => {
				const filePath = constructPath(node.path, file);
				const fileInfo = fs.statSync(filePath);
				return {
					name: file,
					path: filePath,
					loaded: false,
					children: fileInfo.isDirectory()
						? [{ path: 'placeholder' }]
						: null,
				};
			});
		}
		if (props.onlyDirectories) {
			children = children.filter(file => file.children !== null);
		}
		return { ...node, children, loaded: true };
	};

	useEffect(() => {
		if (props.path) {
			const newTree = loadNode({
				path: props.path,
				name: props.path,
			});
			setTree(newTree);
		}
	}, [ props.path ]);

	const handleRowExpanded = (row, path) => {
		const newTree = clone(tree);
		let expandedNode = findNode(newTree, node => node.path === row.path);
		if (expandedNode && !expandedNode.loaded) {
			const loadedNode = loadNode(expandedNode);
			expandedNode.expanded = true;
			expandedNode.loaded = true;
			expandedNode.children = loadedNode.children;
		}
		setTree(newTree);
	};

	const handleRowSelected = (row, path) => {
		print('handleRowSelected', stringify(row, path));
	};

	if (tree === null) {
		return null;
	}

	return (
		<TreeView
			treeStore={[ tree ]}
			onRowExpanded={handleRowExpanded}
			onRowSelected={handleRowSelected}
		>
			<TreeViewColumn>
				<CellRendererText dataFunc={row => row.name} />
			</TreeViewColumn>
		</TreeView>
	);
};

const App = (props) => {
	return (
		<Window title="FileTree" defaultWidth={640} defaultHeight={480}>
			<Box orientation={Gtk.Orientation.HORIZONTAL} homogeneous={true}>
				<FileTree path="/" onlyDirectories={true} />
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);

