import { Gtk } from '../env';
import {
	updateInstanceProps,
	updateInstanceSignals,
	rewriteSignalHandler,
	isProp,
	isSignal,
} from '../lib';

const metaProps = [
	'pack',
];

const isMeta = (prop) => metaProps.includes(prop);

export default class Widget {
	get type() {
		return Gtk.Widget;
	}

	get meta() {
		return this._meta || [];
	}

	parseProps(props) {
		// TODO: Isn't it better to actually only set valid props inside lib.js?!
		const invalidProps = [ 'children', 'className' ];

		return props
			.filter(([ prop ]) => !invalidProps.includes(prop));

		/*
		return props.map(([ prop, value ]) => {
			if (prop === 'children') {
				return null;
			}

			// TODO: Refactor this
			if (prop === 'css') {
				if (this.instance) {
					const cssProvider = new Gtk.CssProvider();
					cssProvider.load_from_data(value);

					this.instance.get_style_context().add_provider(
						cssProvider,
						Gtk.GTK_STYLE_PROVIDER_PRIORITY_USER,
					);
				}

				return null;
			}

			return [ prop, value ];
		}).filter(set => set !== null);
		*/
	}

	createInstance(props) {
		// Keep track of classNames from props
		this.classNames = [];

		// Let subclasses optionally handle parsing.
		const parsedProps = this.parseProps(props);

		// Create an instance with props without children and no signals.
		const appliedProps = parsedProps
			.filter(([ prop ]) => isProp(this.type, prop))
			.filter(([ prop ]) => !isMeta(prop))
			.filter(([ prop ]) => prop !== 'children');

		// Save any meta props.
		this._meta = parsedProps
			.filter(([ prop ]) => isMeta(prop));

		this.instance = new this.type(Object.fromEntries(appliedProps));

		// Trigger an update to initially set any signal handlers. This will
		// also set value props but that shouldn't matter.
		const appliedSet = props
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
		// Reset className
		changes.unset.filter(prop => prop === 'className').forEach(prop => {
			this.classNames.forEach(className => {
				this.instance.get_style_context().remove_class(className);
			});
		});

		// Update className
		changes.set.filter(([ prop ]) => prop === 'className').forEach(([ prop, value ]) => {
			this.classNames.forEach(className => {
				this.instance.get_style_context().remove_class(className);
			});
			this.classNames = value.split(' ').map(className => className.trim());
			this.classNames.forEach(className => {
				this.instance.get_style_context().add_class(className);
			});
		});

		const parsedSet = this.parseProps(changes.set);

		updateInstanceProps(this.instance, {
			unset: changes.unset.filter(prop => isProp(this.type, prop)),
			set: parsedSet.filter(([ prop ]) => isProp(this.type, prop)),
		});

		updateInstanceSignals(this.instance, {
			unset: changes.unset.filter(prop => isSignal(this.type, prop)),
			set: parsedSet.filter(([ prop ]) => isSignal(this.type, prop)),
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

