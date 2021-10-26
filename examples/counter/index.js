import React, { useState, useEffect } from 'react';

import {
	createApp,
	loadCss,
	Gtk,
	Window,
	Box,
	Label,
	Button,
} from '../../src/index';

const App = (props) => {
	const [ counter, setCounter ] = useState(0);

	useEffect(() => {
		loadCss('.test_label { border: solid 1px red; }');
	}, []);

	return (
		<Window title="Counter" defaultWidth={640} defaultHeight={480}>
			<Box orientation={Gtk.Orientation.VERTICAL} homogeneous={true}>
				<Label label={`Clicked ${counter} times`} className="test_label" />
				<Button label="Click me!" onClicked={() => setCounter(counter + 1)} />
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
