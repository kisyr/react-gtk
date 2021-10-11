import { Gtk } from '../env';
import {
	updateInstanceProps,
	updateInstanceSignals,
	rewriteSignalHandler,
	isProp,
	isSignal,
} from '../lib';

export default class Widget {
	get type() {
		return Gtk.Widget;
	}

	constructor(props) {
		// Create an instance with props without children and no signals.
		const appliedProps = Object.fromEntries(Object.entries(props)
			.filter(([ prop ]) => isProp(this.type, prop))
			.filter(([ prop ]) => prop !== 'children')
		);

		this.instance = new this.type(appliedProps);

		// Trigger an update to initially set any signal handlers. This will
		// also set value props but that shouldn't matter.
		const appliedSet = Object.entries(props)
			.filter(([ prop ]) => prop !== 'children');

		this.update({ unset: [], set: appliedSet });
	}

	appendChild(child) {
		if (child.instance instanceof Gtk.GestureClick) {
			return this.instance.add_controller(child.instance);
		}

		if (!this.hasChild(child)) {
			child.instance.insert_after(this.instance, this.instance.get_last_child());
		}
	}

	insertBefore(child, beforeChild) {
		if (child.instance instanceof Gtk.GestureClick) {
			return this.instance.add_controller(child.instance);
		}

		if (!this.hasChild(child)) {
			child.instance.insert_before(this.instance, beforeChild.instance);
		}
	}

	removeChild(child) {
		this.instance.remove(child.instance);
	}

	show() {
		this.instance.show();
	}

	update(changes) {
		updateInstanceProps(this.instance, {
			unset: changes.unset.filter(prop => isProp(this.type, prop)),
			set: changes.set.filter(([ prop ]) => isProp(this.type, prop)),
		});

		updateInstanceSignals(this.instance, {
			unset: changes.unset.filter(prop => isSignal(this.type, prop)),
			set: changes.set.filter(([ prop ]) => isSignal(this.type, prop)),
		});
	}

	getChildren() {
		const children = [];

		for (
			let child = this.instance.get_first_child();
			!!child;
			child = child.get_next_sibling()
		) {
			children.push(child);
		}

		return children;
	}

	hasChild(child) {
		const children = this.getChildren();

		return children.includes(child.instance);
	}
}

