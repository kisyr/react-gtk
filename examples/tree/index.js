import React, { useState } from 'react';
import { createApp } from '../../src/render';
import {
	Window,
	Box,
	TreeView,
	TreeViewColumn,
	CellRendererText,
	Button,
} from '../../src/components';

const R = require('ramda');

const modelA = [
	{
		path: '/',
		children: [
			{
				path: '/tmp/',
				children: [
					{
						path: '/tmp/images/',
					},
					{
						path: '/tmp/foo/',
					},
				],
			},
			{
				path: '/bar/',
			},
		],
	},
];

const modelB = [
	{
		path: '/home/foo/',
		children: [
			{
				path: '/home/foo/foobar/',
			},
		],
	},
];

const App = (props) => {
	const [ model, setModel ] = useState(modelA);

	const handleRowExpanded = (row, indices) => {
		console.log('handleRowExpanded', JSON.stringify(row), JSON.stringify(indices));
	};

	const handleRowSelected = (row) => {
		console.log('handleRowSelected', JSON.stringify(row));
	};

	return (
		<Window title="Counter" defaultWidth={640} defaultHeight={480}>
			<Box>
				<TreeView
					treeStore={model}
					onRowExpanded={handleRowExpanded}
					onRowSelected={handleRowSelected}
				>
					<TreeViewColumn>
						<CellRendererText dataFunc={row => (row.path.split('/').length || 2) - 1} />
						<CellRendererText dataFunc={row => row.path} />
					</TreeViewColumn>
				</TreeView>
				<Button label="Test" onClicked={() => setModel(modelB)} />
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
