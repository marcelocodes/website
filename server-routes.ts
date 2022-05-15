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

const ROUTES = new Map(
	Object.entries({
		'/': '/index.html',
		'/about': '/about.html'
	})
);

const SYNTHETIC_ROUTES = new Map(
	Object.entries({
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

async function loadRouteBase(
	pathname: string,
	fileMap: Map<string, string>
): Promise<Response | null> {
	const html = fileMap.get(pathname);
	if (!html) {
		return null;
	}

	return new Response(await loadFile(html), {
		headers: {
			'content-type': FILE_EXTENSION_TO_CONTENT_TYPE.get('html') ?? '' // 'html' is there.
		}
	});
}

export async function loadRoute(pathname: string): Promise<Response | null> {
	return await loadRouteBase(pathname, ROUTES);
}

export async function load404(): Promise<Response> {
	const error404 = await loadRouteBase('/synthetic/404', SYNTHETIC_ROUTES);
	if (!error404) {
		// Should never get here, as we the synthetic page is manually put there.
		console.log("Couldn't find 404 page.");
		return new Response();
	}

	return error404;
}

export async function loadResource(pathname: string): Promise<Response | null> {
	// 'example.css'
	//    .split('.')  // => ['example', 'css']
	//    .slice(-1)   // => ['css']
	//    [0]          // => 'css'
	const extension = pathname.split('.').slice(-1)[0];

	const headers = {
		'content-type': FILE_EXTENSION_TO_CONTENT_TYPE.get(extension) ?? 'text/plain'
	};

	let file;
	try {
		file = await loadFile(pathname);
	} catch (_err) {
		return null;
	}

	return new Response(file, { headers });
}
