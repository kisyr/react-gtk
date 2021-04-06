const Gio = imports.gi.Gio;
const { Buffer } = require('buffer');

function getEncodingFromOptions(options, defaultEncoding = 'utf8') {
	if (options === null) {
		return defaultEncoding;
	}

	if (typeof options === 'string') {
		return options;
	}

	if (typeof options === 'object' && typeof options.encoding === 'string') {
		return options.encoding;
	}

	return defaultEncoding;
}

export function existsSync(path) {
	// TODO: accept buffer and URL too
	if (typeof path !== 'string' || path === '') {
		return false;
	}

	const file = Gio.File.new_for_path(path);
	return file.query_exists(null);
}

export function exists(path) {
	return new Promise(resolve => {
		const result = existsSync(path);
		resolve(result);
	});
}

export function readdirSync(path, options = 'utf8') {
	const encoding = getEncodingFromOptions(options);
	const dir = Gio.File.new_for_path(path);
	const list = [];

	const enumerator = dir.enumerate_children('standard::*', 0, null);
	let info = enumerator.next_file(null);

	while (info) {
		const child = enumerator.get_child(info);
		const fileName = child.get_basename();

		if (encoding === 'buffer') {
			const encodedName = Buffer.from(fileName);
			list.push(encodedName);
		} else {
			const encodedName = Buffer.from(fileName).toString(encoding);
			list.push(encodedName);
		}

		info = enumerator.next_file(null);
	}

	return list;
}

export function readdir(path, options = 'utf8') {
	return new Promise(resolve => {
		const result = readdirSync(path, options);
		resolve(result);
	});
}

export function readFileSync(path, options = { encoding: null, flag: 'r' }) {
	const file = Gio.File.new_for_path(path);

	const [ok, data] = file.load_contents(null);

	if (!ok) {
		// TODO: throw a better error
		throw new Error('failed to read file');
	}

	const encoding = getEncodingFromOptions(options, 'buffer');
	if (encoding === 'buffer') {
		return Buffer.from(data);
	}

	return data.toString(encoding);
}

export function readFile(path, options = { encoding: null, flag: 'r' }) {
	return new Promise(resolve => {
		const result = readFileSync(path, options);
		resolve(result);
	});
}

export function mkdirSync(path, options = { recursive: false }) {
	const file = Gio.File.new_for_path(path);

	try {
		const result = file.make_directory_with_parents(null);
		// TODO: Should return the first path created if recursive
		return path;
	} catch (e) {
		return undefined;
	}
}

export function mkdir(path, options = { recursive: false }) {
	return new Promise(resolve => {
		const result = mkdirSync(path, options);
		resolve(result);
	});
}

export function statSync(path, options = {}) {
	const file = Gio.File.new_for_path(path);

	const info = file.query_info('standard::*', 0, null);

	let result = {
		size: 0,
		isDirectory: () => false,
		isFile: () => false,
		isSymbolicLink: () => false,
	};

	if (info) {
		const infoFileType = info.get_file_type();

		result = {
			size: info.get_size(),
			isDirectory: () => infoFileType === Gio.FileType.DIRECTORY,
			isFile: () => infoFileType === Gio.FileType.REGULAR,
			isSymbolicLink: () => infoFileType === Gio.FileType.SYMBOLIC_LINK,
		};

		// Unref here seems to break when calling this function a lot?
		//info.unref();
	}

	return result;
}

export default {
	exists,
	existsSync,
	readdir,
	readdirSync,
	readFile,
	readFileSync,
	mkdir,
	mkdirSync,
	statSync,
};
