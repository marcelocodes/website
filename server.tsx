import { bold, cyan, green, red, yellow } from 'https://deno.land/std@0.131.0/fmt/colors.ts';
import { Application, HttpError, Status } from 'https://deno.land/x/oak@v10.5.1/mod.ts';
import { join } from 'https://deno.land/std@0.139.0/path/mod.ts';

const STATIC_FILES_PATH = join(Deno.cwd(), 'build');

const app = new Application();

// Error handler middleware
app.use(async (context, next) => {
	try {
		await next();
	} catch (e) {
		if (e instanceof HttpError) {
			if (e.status === Status.NotFound) {
				context.response.status = e.status;
				context.response.body = await Deno.readFile(join(STATIC_FILES_PATH, '404.html'));
				return;
			}
		} else if (e instanceof Error) {
			context.response.status = 500;
			context.response.body = `<!DOCTYPE html>
            <html>
              <body>
                <h1>500 - Internal Server Error</h1>
              </body>
            </html>`;
			console.log('Unhandled Error:', red(bold(e.message)));
			console.log(e.stack);
		}
	}
});

// Logger
app.use(async (context, next) => {
	await next();
	const rt = context.response.headers.get('X-Response-Time');
	console.log(
		`${green(context.request.method)} ${cyan(context.request.url.pathname)} - ${bold(String(rt))}`
	);
});

// Response Time
app.use(async (context, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	context.response.headers.set('X-Response-Time', `${ms}ms`);
});

// Send static content
app.use(async (context) => {
	await context.send({
		root: STATIC_FILES_PATH,
		index: 'index.html'
	});
});

app.addEventListener('listen', ({ hostname, port, serverType }) => {
	console.log(bold('Start listening on ') + yellow(`${hostname}:${port}`));
	console.log(bold('  using HTTP server: ' + yellow(serverType)));
});

await app.listen({ hostname: 'localhost', port: 8000 });
