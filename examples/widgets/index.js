import React, { useState } from 'react';
import { createApp } from '../../src/render';
import { Window, HeaderBar, Box, Label, Button, SpinButton } from '../../src/components';
import { Gtk } from '../../src/env';

const LabelExample = (props) => {
	return (
		<Label label="Hello world!" />
	);
};

const ButtonExample = (props) => {
	const handleClick = () => {
		print('You clicked me!');
	};

	return (
		<Button label="Click me!" onClicked={handleClick} />
	);
};

const SpinButtonExample = (props) => {
	const [ value, setValue ] = useState(5);

	const handleValueChanged = (newValue) => {
		print('SpinButton::handleValueChanged', newValue);
		setValue(newValue);
	};

	return (
		<SpinButton
			lower={2}
			upper={12}
			stepIncrement={2}
			value={value}
			onValueChanged={handleValueChanged}
		/>
	);
};

const App = (props) => {
	const [ counter, setCounter ] = useState(0);

	return (
		<Window title="Widgets" defaultWidth={640} defaultHeight={480}>
			<HeaderBar showCloseButton={true} hasSubtitle={true} title="Widgets" />
			<Box orientation={Gtk.Orientation.VERTICAL}>
				<LabelExample />
				<ButtonExample />
				<SpinButtonExample />
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
