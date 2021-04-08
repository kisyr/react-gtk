import React, { useState, useEffect } from 'react';
import clone from 'ramda/src/clone';
import { createApp } from '../../src/render';
import {
	Window,
	ScrolledWindow,
	Box,
	Expander,
	Label,
	TreeView,
	TreeViewColumn,
	CellRendererText,
} from '../../src/components';
import { Gtk } from '../../src/env';
import fs from './fs';

function constructPath(base, part) {
	return `/${base}/${part}`.replace(/\/+/g, '/');
}

function getBaseName(path) {
	return path === '/'
		? path
		: path.split('/').slice(-1).pop();
}

const FileList = (props) => {
	const [ info, setInfo ] = useState(null);
	const [ files, setFiles ] = useState(null);
	const [ expanded, setExpanded ] = useState(false);

	const handleToggle = () => {
		setExpanded(!expanded);
	};

	useEffect(() => {
		if (props.path) {
			const newInfo = fs.statSync(props.path);
			setInfo(newInfo);
			setFiles(null);
		}
	}, [ props.path ]);

	useEffect(() => {
		if (props.path && expanded && files === null) {
			const newFiles = fs.readdirSync(props.path).map(file => ({
				name: file,
				path: constructPath(props.path, file),
			}));
			setFiles(newFiles);
		}
	}, [ expanded ]);

	const fileName = getBaseName(props.path);
	const depth = props.depth || 0;

	if (info === null) {
		return null;
	}

	return (
		<Box
			orientation={Gtk.Orientation.VERTICAL}
			marginStart={depth * 5}
		>
			{info.isDirectory() ? (
				<Expander
					label={fileName}
					halign={Gtk.Align.START}
					expanded={expanded}
					onChangeExpanded={handleToggle}
				>
					<Box orientation={Gtk.Orientation.VERTICAL}>
						{files !== null && files.map((file, index) => (
							<FileList path={file.path} depth={depth + 1} />
						))}
					</Box>
				</Expander>
			) : (
				<Label halign={Gtk.Align.START} label={fileName} />
			)}
		</Box>
	);
};

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
				<ScrolledWindow>
					<FileList path="/" />
				</ScrolledWindow>
				<ScrolledWindow>
					<FileTree path="/" onlyDirectories={true} />
				</ScrolledWindow>
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);

