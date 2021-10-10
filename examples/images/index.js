import React, { useState } from 'react';

import {
	createApp,
	Window,
	Box,
	Image,
	Picture,
} from '../../src/index';

const App = (props) => {
	return (
		<Window title="Counter" defaultWidth={640} defaultHeight={480}>
			<Box>
				<Image file="./examples/images/test.jpg" />
				<Picture file="./examples/images/test.jpg" />
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
