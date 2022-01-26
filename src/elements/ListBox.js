import { Gtk } from '../env';
import Widget from './Widget';

export default class ListBox extends Widget {
	get type() {
		return Gtk.ListBox;
	}

	parseProps(props) {
		return props.map(([ prop, value ]) => {
			if (prop === 'onRowSelected') {
				const newValue = (list, row) => {
					const rowValue = row['user_value'] || null;
					value(rowValue);
				};

				return [ prop, newValue ];
			}

			return [ prop, value ];
		}).filter(set => set !== null);
	}

	appendChild(child) {
		if (!this.hasChild(child)) {
			this.instance.append(child.instance);
		}
	}

	insertBefore(child, beforeChild) {
		return this.appendChild(child);
	}
}

