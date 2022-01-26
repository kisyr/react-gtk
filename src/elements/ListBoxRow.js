import { Gtk } from '../env';
import Widget from './Widget';

export default class ListBoxRow extends Widget {
	get type() {
		return Gtk.ListBoxRow;
	}

	parseProps(props) {
		return props.map(([ prop, value ]) => {
			// In order to save this custom property for this widget
			// we remove this prop if instance isn't created so as not
			// to give the widget constructor this property. After it's
			// constructed though we are triggering a prop update where
			// it's safe to supply custom properties to widgets.
			// Basically, prevent widget constructor from getting this
			// custom property, but do supply it for property updates.
			if (prop === 'value') {
				if (!this.instance) {
					return null;
				}

				prop = 'user_value';
			}

			return [ prop, value ];
		}).filter(set => set !== null);
	}

	appendChild(child) {
		if (!this.hasChild(child)) {
			this.instance.set_child(child.instance);
		}
	}

	insertBefore(child, beforeChild) {
		return this.appendChild(child);
	}
}

