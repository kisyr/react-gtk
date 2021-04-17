import React from 'react';

function wrap(elementName) {
	return (props) => React.createElement(
		elementName,
		props,
		props.children
	);
}

const Box = wrap('gtk-box');
const Button = wrap('gtk-button');
const CellRendererText = wrap('gtk-cellrenderertext');
const Entry = wrap('gtk-entry');
const Expander = wrap('gtk-expander');
const EventBox = wrap('gtk-eventbox');
const HeaderBar = wrap('gtk-headerbar');
const Image = wrap('gtk-image');
const Label = wrap('gtk-label');
const ScrolledWindow = wrap('gtk-scrolledwindow');
const SpinButton = wrap('gtk-spinbutton');
const Spinner = wrap('gtk-spinner');
const TreeView = wrap('gtk-treeview');
const TreeViewColumn = wrap('gtk-treeviewcolumn');
const Window = wrap('gtk-window');

export {
	Box,
	Button,
	CellRendererText,
	Entry,
	Expander,
	EventBox,
	HeaderBar,
	Image,
	Label,
	ScrolledWindow,
	SpinButton,
	Spinner,
	TreeView,
	TreeViewColumn,
	Window,
};

