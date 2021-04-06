import React, { useState } from 'react';
import { createApp } from '../../src/render';
import {
	Window,
	HeaderBar,
	Box,
	Label,
	Button,
	SpinButton,
	Entry,
} from '../../src/components';
import { Gtk } from '../../src/env';

const SpinButtonExample = (props) => {
	const [ value, setValue ] = useState(5);

	const handleValueChanged = (newValue) => {
		print('SpinButton::handleValueChanged', newValue);
		if (props.noop) {
			setValue(newValue);
		}
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

const EntryExample = (props) => {
	const [ text, setText ] = useState('');

	const handleChanged = (newText) => {
		print('Entry::handleChanged', newText);
		if (props.noop) {
			setText(newText);
		}
	};

	return (
		<Entry text={text} onChanged={handleChanged} />
	);
};

const App = (props) => {
	const [ noop, setNoop ] = useState(true);

	const handleToggleNoop = () => {
		setNoop(!noop);
	};

	return (
		<Window title="Widgets" defaultWidth={640} defaultHeight={480}>
			<HeaderBar showCloseButton={true} hasSubtitle={true} title="Widgets" />
			<Box orientation={Gtk.Orientation.VERTICAL} homogeneous={true}>
				<Box orientation={Gtk.Orientation.HORIZONTAL}>
					<Label label={noop ? 'Widgets are updating' : 'Widgets are noop'} />
					<Button label="Toggle noop" onClicked={handleToggleNoop} />
				</Box>
				<SpinButtonExample noop={noop} />
				<EntryExample noop={noop} />
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
