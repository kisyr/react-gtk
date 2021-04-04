import { Gtk } from '../env';
import { createWidget } from '../lib';

const Window = (props, rootContainerInstance) => {
	const appliedProps = {
		...props,
		application: rootContainerInstance,
	};

	const {
		type,
		instance,
		appendChild,
		insertBefore,
		removeChild,
		show,
		update,
	} = createWidget(Gtk.Window, appliedProps);

	const appliedAppendChild = (parentElement, childElement) => {
		const children = parentElement.instance.get_children();

		if (
			!children.includes(childElement.instance) &&
			childElement.instance instanceof Gtk.HeaderBar
		) {
			parentElement.instance.set_titlebar(childElement.instance);
			return;
		}

		appendChild(parentElement, childElement);
	};

	const appliedInsertBefore = appliedAppendChild;

	const appliedRemoveChild = (parentElement, childElement) => {
		if (childElement.instance instanceof Gtk.HeaderBar) {
			parentElement.instance.set_titlebar(null);
			return;
		}

		removeChild(parentElement, childElement);
	};

	return {
		type,
		instance,
		appendChild: appliedAppendChild,
		insertBefore: appliedInsertBefore,
		removeChild: appliedRemoveChild,
		show,
		update,
	};
};

export default Window;

