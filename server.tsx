import { serve } from './server-deps.ts';
import { loadRoute, loadResource } from './server-routes.ts';

async function handleRequest(request: Request): Promise<Response> {
	const { pathname } = new URL(request.url);

	const route = await loadRoute(pathname);
	if (route) {
		return route;
	}

	return await loadResource(pathname);
}

console.log('Serving...');
serve(handleRequest);
