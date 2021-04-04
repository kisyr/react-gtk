import React, { useState } from 'react';
import { createApp } from '../../src/render';
import { Window, Box, Image } from '../../src/components';

const App = (props) => {
	return (
		<Window title="Counter" defaultWidth={640} defaultHeight={480}>
			<Box>
				<Image file="./examples/images/test.jpg" />
				<Image pixbuf={{
					filename: './examples/images/test.jpg',
					width: 100,
					height: -1,
					preserveAspectRatio: true,
				}} />
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
