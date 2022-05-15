import { serve } from './server-deps.ts';
import { loadRoute, loadResource, load404 } from './server-routes.ts';

async function handleRequest(request: Request): Promise<Response> {
	const { pathname } = new URL(request.url);

	// Used for html pages.
	const route = await loadRoute(pathname);
	if (route) {
		return route;
	}

	// Used for javascript, css, svg, fonts, etc.
	const resource = await loadResource(pathname);
	if (resource) {
		return resource;
	}

	// Used when a page is not found.
	return await load404();
}

console.log('Serving...');
serve(handleRequest);
