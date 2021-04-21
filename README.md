# React GTK

Aims to provide simple React components for GTK widgets for use with GJS with support for signal handlers and controlled values.

We can specify standard properties and signal callbacks for components like:

```
<Box orientation={Gtk.Orientation.VERTICAL}>
	<Button label="Click me!" onClicked={() => console.log('clicked')} />
</Box>
```

Any property with the signature `onX` will connect a signal handler for `x`.

We can do controlled components like:

```
<Entry text={currentText} onChangeText={setCurrentText} />
```

Any property with the signature `onChangeX` will connect a signal handler for `notify::x` which resets the widgets X value and calls the property callback with the new X value.

