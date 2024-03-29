import React, { useState } from 'react';

import {
	createApp,
	Gtk,
	Window,
	HeaderBar,
	Box,
	Label,
	Button,
	SpinButton,
	MenuButton,
	Entry,
	Expander,
	Popover,
	GestureClick,
} from '../../src/index';

const SpinButtonExample = (props) => {
	const [ value, setValue ] = useState(5);

	const handleChange = (newValue) => {
		print('SpinButton::handleChange', newValue);
		if (!props.noop) {
			setValue(newValue);
		}
	};

	return (
		<SpinButton
			lower={2}
			upper={12}
			stepIncrement={2}
			value={value}
			onChangeValue={handleChange}
		/>
	);
};

const EntryExample = (props) => {
	const [ text, setText ] = useState('');

	const handleChange = (newText) => {
		print('Entry::handleChange', newText);
		if (!props.noop) {
			setText(newText);
		}
	};

	return (
		<Entry text={text} onChangeText={handleChange} />
	);
};

const ExpanderExample = (props) => {
	const [ expanded, setExpanded ] = useState(false);

	const handleChange = () => {
		print('Expander::handleChange');
		print('noop = ', props.noop, stringify(props));
		if (!props.noop) {
			print('Expander::setExpanded', !expanded);
			setExpanded(!expanded);
		}
	};

	return (
		<Expander expanded={expanded} onChangeExpanded={handleChange}>
			<Label label="Expanded!" />
		</Expander>
	);
};

const App = (props) => {
	const [ noop, setNoop ] = useState(true);

	const handleToggleNoop = () => {
		setNoop(!noop);
	};

	return (
		<Window title="Widgets" defaultWidth={640} defaultHeight={480}>
			<HeaderBar>
				<Button label="Test" onClicked={() => log('Clicked!')} />
				<MenuButton iconName="open-menu-symbolic" pack={Gtk.PackType.END}>
					<Popover>
						<Box orientation={Gtk.Orientation.VERTICAL}>
							<Label label="Foo" />
							<Label label="Bar" />
						</Box>
					</Popover>
				</MenuButton>
			</HeaderBar>
			<Box orientation={Gtk.Orientation.VERTICAL} homogeneous={true}>
				<Box orientation={Gtk.Orientation.HORIZONTAL}>
					<Label label={!noop ? 'Widgets are updating' : 'Widgets are noop'} />
					<Button label="Toggle noop" onClicked={handleToggleNoop} />
				</Box>
				<SpinButtonExample noop={noop} />
				<EntryExample noop={noop} />
				<ExpanderExample noop={noop} />
				<Box>
					<GestureClick onPressed={() => print('GestureClick::onPressed')} />
					<Label label="GestureClick test" />
				</Box>
			</Box>
		</Window>
	);
}

createApp(<App />).run([]);
