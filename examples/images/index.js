import React, { useState } from 'react';

import {
	createApp,
	Window,
	Box,
	Image,
	Picture,
	GestureClickHandler,
} from '../../src/index';

const App = (props) => {
	return (
		<Window title="Counter" defaultWidth={640} defaultHeight={480}>
			<GestureClickHandler onPressed={() => print('onPressed!')}>
				<Box>
					<Image file="./examples/images/test.jpg" />
					<Picture file="./examples/images/test.jpg" />
				</Box>
			</GestureClickHandler>
		</Window>
	);
}

createApp(<App />).run([]);
