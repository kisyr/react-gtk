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
		const children = this.instance.get_children();

		if (!children.includes(child.instance)) {
			this.instance.add(child.instance);
		}
	}

	insertBefore(child, beforeChild) {
		return this.appendChild(child);
	}

	removeChild(child) {
		this.instance.remove(child.instance);
	}

	show() {
		this.instance.show();
	}

	update(changes) {
		log('-- update --', stringify(changes));

		updateInstanceProps(this.instance, {
			unset: changes.unset.filter(prop => isProp(this.type, prop)),
			set: changes.set.filter(([ prop ]) => isProp(this.type, prop)),
		});

		updateInstanceSignals(this.instance, {
			unset: changes.unset.filter(prop => isSignal(this.type, prop)),
			set: changes.set.filter(([ prop ]) => isSignal(this.type, prop)),
		});
	}
}

