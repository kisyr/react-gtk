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
const HeaderBar = wrap('gtk-headerbar');
const Image = wrap('gtk-image');
const Label = wrap('gtk-label');
const SpinButton = wrap('gtk-spinbutton');
const TreeView = wrap('gtk-treeview');
const TreeViewColumn = wrap('gtk-treeviewcolumn');
const Window = wrap('gtk-window');

export {
	Box,
	Button,
	CellRendererText,
	Entry,
	HeaderBar,
	Image,
	Label,
	SpinButton,
	TreeView,
	TreeViewColumn,
	Window,
};

