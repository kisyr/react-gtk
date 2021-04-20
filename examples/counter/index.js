import React, { useState } from 'react';

import {
	createApp,
	Gtk,
	Window,
	Box,
	Label,
	Button,
} from '../../src/index';

const App = (props) => {
	const [ counter, setCounter ] = useState(0);

	return (
		<Window title="Counter" defaultWidth={640} defaultHeight={480}>
			<Box orientation={Gtk.Orientation.VERTICAL} homogeneous={true}>
				<Label label={`Clicked ${counter} times`} />
				<Button label="Click me!" onClicked={() => setCounter(counter + 1)} />
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
