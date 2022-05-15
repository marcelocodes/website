// Content types that my app uses.
const FILE_EXTENSION_TO_CONTENT_TYPE = new Map(
	Object.entries({
		css: 'text/css',
		js: 'text/javascript',
		woff: 'font/woff',
		woff2: 'font/woff2',
		svg: 'image/svg+xml',
		json: 'application/json',
		html: 'text/html; charset=utf-8',
		png: 'image/png',
		txt: 'text/plain',
		webp: 'image/webp'
	})
);

const PATHNAME_TO_HTML_FILE = new Map(
	Object.entries({
		'/': '/index.html',
		'/about': '/about.html',
		'/synthetic/404': '/404.html'
	})
);

/**
 * `pathname` has the format `/favicon.ico`, so we need to change it, to be able
 * to load from disk.
 */
async function loadFile(pathname: string): Promise<Uint8Array> {
	return await Deno.readFile(`./build${pathname}`);
}

export async function loadRoute(pathname: string): Promise<Response | null> {
	const html = PATHNAME_TO_HTML_FILE.get(pathname);
	if (!html) {
		return null;
	}

	return new Response(await loadFile(html), {
		headers: {
			'content-type': FILE_EXTENSION_TO_CONTENT_TYPE.get('html') ?? '' // 'html' is there.
		}
	});
}

export async function loadResource(pathname: string): Promise<Response> {
	// 'example.css'
	//    .split('.')  // => ['example', 'css']
	//    .slice(-1)   // => ['css']
	//    [0]          // => 'css'
	const extension = pathname.split('.').slice(-1)[0];
	console.log(extension);

	const headers = {
		'content-type': FILE_EXTENSION_TO_CONTENT_TYPE.get(extension) ?? 'text/plain'
	};

	let file;
	try {
		file = await loadFile(pathname);
	} catch (_err) {
		const synthetic404 = await loadRoute('/synthetic/404');
		if (!synthetic404) {
			console.log("Couldn't find 404 page.");
			return new Response();
		}

		return synthetic404;
	}

	return new Response(file, { headers });
}
