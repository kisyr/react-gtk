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
const FlowBox = wrap('gtk-flowbox');
const GestureClick = wrap('gtk-gestureclick');
const HeaderBar = wrap('gtk-headerbar');
const Image = wrap('gtk-image');
const Label = wrap('gtk-label');
const MenuButton = wrap('gtk-menubutton');
const ScrolledWindow = wrap('gtk-scrolledwindow');
const SpinButton = wrap('gtk-spinbutton');
const Spinner = wrap('gtk-spinner');
const Picture = wrap('gtk-picture');
const Popover = wrap('gtk-popover');
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
	FlowBox,
	GestureClick,
	HeaderBar,
	Image,
	Label,
	MenuButton,
	ScrolledWindow,
	SpinButton,
	Spinner,
	Picture,
	Popover,
	TreeView,
	TreeViewColumn,
	Window,
};

