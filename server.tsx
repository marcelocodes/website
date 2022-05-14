import { serve } from 'https://deno.land/std@0.114.0/http/server.ts';

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

/**
 * `pathname` has the format `/favicon.ico`, so we need to change it, to be able
 * to load from disk.
 */
async function loadFile(pathname: string): Promise<Uint8Array> {
	return await Deno.readFile(`./build${pathname}`);
}

/**
 * Example:
 *
 *  'filename.css'
 * 		.split('.')  // => ['filename', 'css']
 * 		.slice(-1)   // => ['css']
 *    [0]          // => 'css'
 */
function getExtension(pathname: string): string {
	return pathname.split('.').slice(-1)[0];
}

function getContentType(pathname: string): string | Error {
	const extension = getExtension(pathname);
	const contentType = FILE_EXTENSION_TO_CONTENT_TYPE.get(extension);

	if (!contentType) {
		return Error(`Invalid extension: ${extension}`);
	}

	return contentType;
}

function shouldServeRoot(pathname: string): boolean {
	const extension = getExtension(pathname);
	const isUnsupportedPathOrFileExtension = !FILE_EXTENSION_TO_CONTENT_TYPE.get(extension);
	const isIndex = pathname === '/';

	return isIndex || isUnsupportedPathOrFileExtension;
}

async function handleRequest(request: Request): Promise<Response> {
	const { pathname } = new URL(request.url);

	if (shouldServeRoot(pathname)) {
		return new Response(await loadFile('/index.html'), {
			headers: {
				'content-type': FILE_EXTENSION_TO_CONTENT_TYPE.get('html') ?? '' // 'html' is there.
			}
		});
	}

	const contentType = getContentType(pathname);

	if (contentType instanceof Error) {
		console.log(contentType.message);
		Deno.exit(1);
	}

	const file = await loadFile(pathname);
	return new Response(file, {
		headers: {
			'content-type': contentType
		}
	});
}

console.log('Serving...');
serve(handleRequest);
