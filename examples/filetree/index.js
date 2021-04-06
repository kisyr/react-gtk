import React, { useState, useEffect } from 'react';
import { createApp } from '../../src/render';
import {
	Window,
	ScrolledWindow,
	Box,
	Expander,
	Label,
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

const App = (props) => {
	return (
		<Window title="FileTree" defaultWidth={640} defaultHeight={480}>
			<ScrolledWindow>
				<FileList path="/" />
			</ScrolledWindow>
		</Window>
	);
}

createApp(<App />).run([]);

