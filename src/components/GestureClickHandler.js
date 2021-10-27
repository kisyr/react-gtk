import React, { useRef, useCallback, useEffect } from 'react';
import { Gtk } from '../env';
import { updateInstanceSignals, isSignal } from '../lib';

const GestureClickHandler = ({ children, ...props }) => {
	const type = Gtk.GestureClick;
	const controller = useRef(new type);

	useEffect(() => {
		const unset = Object.keys(props)
			.filter(prop => isSignal(type, prop));
		const set = Object.entries(props)
			.filter(([ prop ]) => isSignal(type, prop));

		updateInstanceSignals(controller.current, { unset, set });
	});

	const updateChild = useCallback(publicInstance => {
		if (publicInstance) {
			const instance = publicInstance.instance;
			instance.add_controller(controller.current);
		}
	}, []);

	return !!children && React.Children.map(children, child => (
		React.cloneElement(child, {
			ref: updateChild,
		})
	));
};

export default GestureClickHandler;

