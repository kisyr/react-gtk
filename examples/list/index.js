import React, { useState } from 'react';

import {
	createApp,
	Gtk,
	Window,
	Box,
	ListBox,
	ListBoxRow,
	Label,
} from '../../src/index';

const App = (props) => {
	const handleRowSelected = (value) => {
		console.log('handleRowSelected', JSON.stringify(value));
	};

	const rows = [
		{ value: 'first', label: 'First' },
		{ value: 'second', label: 'Second' },
		{ value: 'third', label: 'Third' },
	];

	return (
		<Window title="List" defaultWidth={640} defaultHeight={480}>
			<Box orientation={Gtk.Orientation.HORIZONTAL} homogeneous={true}>
				<ListBox onRowSelected={handleRowSelected}>
					{rows.map((row, index) => (
						<ListBoxRow key={index} value={row.value}>
							<Box orientation={Gtk.Orientation.VERTICAL}>
								<Label label={row.label} />
								<Label label="label" />
							</Box>
						</ListBoxRow>
					))}
				</ListBox>
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
