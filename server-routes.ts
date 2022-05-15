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

const contentTypeFromPathname = (pathname: string) =>
	FILE_EXTENSION_TO_CONTENT_TYPE.get(pathname.split('.').slice(-1)[0]);

/**
 * `pathname` has the format `/favicon.ico`, so we need to change it, to be able
 * to load from disk.
 */
async function loadFile(pathname: string): Promise<Uint8Array> {
	return await Deno.readFile(`./build${pathname}`);
}

export async function loadRoute(pathname: string): Promise<Response | null> {
	if (pathname === '/') {
		return new Response(await loadFile('/index.html'), {
			headers: {
				'content-type': FILE_EXTENSION_TO_CONTENT_TYPE.get('html') ?? '' // 'html' is there.
			}
		});
	}
	if (pathname === '/about') {
		return new Response(await loadFile('/about.html'), {
			headers: {
				'content-type': FILE_EXTENSION_TO_CONTENT_TYPE.get('html') ?? '' // 'html' is there.
			}
		});
	}

	return null;
}

export async function loadResource(pathname: string): Promise<Response> {
	const contentType = contentTypeFromPathname(pathname);
	const headers = {
		'content-type': contentType ?? 'text/plain'
	};

	const file = await loadFile(pathname);
	return new Response(file, { headers });
}
