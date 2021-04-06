// Specify Gtk version
imports.gi.versions.Gtk = "3.0";

const GObject = imports.gi.GObject;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const GdkPixbuf = imports.gi.GdkPixbuf;
const Gtk = imports.gi.Gtk;

// Support for setTimeout/setInterval
window.setInterval = function(func, delay, ...args) {
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
        func(...args);
        return GLib.SOURCE_CONTINUE;
    });
};
window.clearInterval = GLib.source_remove;
window.setTimeout = function(func, delay, ...args) {
    return GLib.timeout_add(GLib.PRIORITY_DEFAULT, delay, () => {
        func(...args);
        return GLib.SOURCE_REMOVE;
    });
};
window.clearTimeout = GLib.source_remove;

// Support log
window.log = function(...args) {
	if (process.env.DEBUG_REACT_GTK) {
		print(...args);
	}
};

// Support console.log
window.console = { log: print, warn: print, error: print };

// Support proper stringify
window.stringify = function(data) {
	return JSON.stringify(data, (key, value) => typeof value === 'undefined' ? null : value);
};

export { GObject, GLib, Gio, GdkPixbuf, Gtk };

