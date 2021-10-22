import { Gtk } from '../env';
import Widget from './Widget';

export default class HeaderBar extends Widget {
	get type() {
		return Gtk.HeaderBar;
	}

	appendChild(child) {
		if (!this.hasChild(child)) {
			const packProp = child.meta.find(([ prop ]) => prop === 'pack');
			const pack = packProp ? packProp[1] : Gtk.PackType.START;

			switch (pack) {
				case Gtk.PackType.START:
				default:
					this.instance.pack_start(child.instance);
					break;
				case Gtk.PackType.END:
					this.instance.pack_end(child.instance);
					break;
			}
		}
	}
}

