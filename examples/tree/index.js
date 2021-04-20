import React, { useState } from 'react';

import {
	createApp,
	Gtk,
	Window,
	Box,
	TreeView,
	TreeViewColumn,
	CellRendererText,
	Button,
} from '../../src/index';

const modelA = [
	{
		path: '/',
		children: [
			{
				path: '/foo',
				expanded: true,
				children: [
					{
						path: '/foo/images',
					},
					{
						path: '/bar/foo',
					},
				],
			},
			{
				path: '/bar',
			},
		],
	},
];

const modelB = [
	{
		path: '/',
		children: [
			{
				path: '/foo',
				children: [
					{
						path: '/foo/images',
						expanded: true,
						children: [
							{
								path: '/foo/images/qux',
							},
						],
					},
					{
						path: '/bar/foo',
					},
				],
			},
			{
				path: '/bar',
			},
		],
	},
];

const App = (props) => {
	const [ model, setModel ] = useState(modelA);

	const handleRowExpanded = (row, indices) => {
		console.log('handleRowExpanded', JSON.stringify(row), JSON.stringify(indices));
	};

	const handleRowCollapsed = (row, indices) => {
		console.log('handleRowCollapsed', JSON.stringify(row), JSON.stringify(indices));
	};

	const handleRowSelected = (row, indices) => {
		console.log('handleRowSelected', JSON.stringify(row), JSON.stringify(indices));
	};

	const handleToggleModel = () => {
		setModel(model === modelA ? modelB : modelA);
	};

	return (
		<Window title="Counter" defaultWidth={640} defaultHeight={480}>
			<Box orientation={Gtk.Orientation.HORIZONTAL} homogeneous={true}>
				<TreeView
					treeStore={model}
					onRowExpanded={handleRowExpanded}
					onRowCollapsed={handleRowCollapsed}
					onRowSelected={handleRowSelected}
				>
					<TreeViewColumn>
						<CellRendererText dataFunc={row => (row.path.split('/').length || 2) - 1} />
						<CellRendererText dataFunc={row => row.path} />
					</TreeViewColumn>
				</TreeView>
				<Button label="Test" onClicked={handleToggleModel} />
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
