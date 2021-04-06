import React, { useState } from 'react';
import uuid from 'react-native-uuid';
import { createApp } from '../../src/render';
import { Window, Box, Label, Button, Image, Entry } from '../../src/components';
import { Gtk } from '../../src/env';

const Task = (props) => {
	const getTaskLabel = () => {
		return props.completed
			? `<span strikethrough="true" alpha="25%">${props.description}</span>`
			: props.description;
	};

	return (
		<Box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
			<Label
				halign={Gtk.Align.START}
				hexpand={true}
				label={getTaskLabel()}
				useMarkup={true}
			/>
			<Button onClicked={props.onToggle}>
				<Image iconName={props.completed ? 'undo' : 'object-select'} />
			</Button>
			<Button onClicked={props.onRemove}>
				<Image iconName="cancel" />
			</Button>
		</Box>
	);
};

const App = (props) => {
	const [ text, setText ] = useState('');
	const [ tasks, setTasks ] = useState([]);

	const handleTextChange = (newText) => {
		print('handleTextChange', newText);
		setText(newText);
	};

	const handleTextSubmit = () => {
		if (text == '') {
			return false;
		}
		setTasks([
			...tasks,
			{ id: uuid.v4(), description: text, completed: false },
		]);
		setText('');
	};

	const handleRemoveTask = (id) => {
		setTasks(tasks.filter(task => task.id !== id));
	};

	const handleToggleTask = (id) => {
		setTasks(tasks.map(task => {
			let newTask = Object.assign({}, task);
			if (newTask.id === id) {
				newTask.completed = !newTask.completed;
			}
			return newTask;
		}));
	};

	return (
		<Window
			title="TodoApp"
			defaultWidth={320}
			defaultHeight={480}
			borderWidth={20}
		>
			<Box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
				<Entry
					text={text}
					onChangeText={handleTextChange}
					onActivate={handleTextSubmit}
				/>
				{tasks.map((task, index) => (
					<Task
						{ ...task }
						onToggle={() => handleToggleTask(task.id)}
						onRemove={() => handleRemoveTask(task.id)}
					/>
				))}
			</Box>
		</Window>
	);
};

createApp(<App />).run([]);
