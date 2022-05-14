import { serve } from 'https://deno.land/std@0.114.0/http/server.ts';

const FILE_EXTENSION_TO_CONTENT_TYPE = new Map(
	Object.entries({
		'.css': 'text/css',
		'.js': 'text/javascript',
		'.woff': 'font/woff',
		'.woff2': 'font/woff2',
		'.svg': 'image/svg+xml',
		'.json': 'application/json',
		'.html': 'text/html; charset=utf-8',
		'.png': 'image/png',
		'.txt': 'text/plain',
		'.webp': 'image/webp'
	})
);

async function handleRequest(request: Request): Promise<Response> {
	const { pathname } = new URL(request.url);

	const file = await Deno.readFile(pathname);

	if (pathname.length < 4) {
		throw new Error('Invalid pathname');
	}

	const fileExtension = pathname.slice(-4); // 'filename.css' => '.css'
	const contentType = FILE_EXTENSION_TO_CONTENT_TYPE.get(fileExtension);

	if (!contentType) {
		throw new Error('Unsupported file type');
	}

	return new Response(file, {
		headers: {
			'content-type': contentType
		}
	});
}

console.log('Listening on http://localhost:8000');
serve(handleRequest);
