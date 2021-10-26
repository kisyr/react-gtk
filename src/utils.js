import { Gdk, Gtk } from './env';

export function loadCss(data) {
	const cssProvider = new Gtk.CssProvider();
	cssProvider.load_from_data(data);

	Gtk.StyleContext.add_provider_for_display(
		Gdk.Display.get_default(),
		cssProvider,
		Gtk.GTK_STYLE_PROVIDER_PRIORITY_USER,
	);
}

