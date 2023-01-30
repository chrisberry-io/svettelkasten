import { json } from '@sveltejs/kit';

export const prerender = true;

export const GET = async () => {
	const data = await Promise.all(
		Object.entries(import.meta.glob('$lib/notes/*.md')).map(async ([path, page]) => {
			const pagedata = await page();
			const { html } = pagedata.default.render();
			const regexp = /<a\s[\w="\s]*href="([^>\\"]+)[^>]*">((?:.(?!<\/a>))*.)<\/a>/g;

			const links = [...html.matchAll(regexp)].map(([, href]) => {
				return { source: path, target: href };
			});

			const slug = path.split('/').pop().split('.').shift();
			return links;
		})
	).then((data) => data.flat());

	return json(data);
};
