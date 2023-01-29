import { json } from '@sveltejs/kit';

export const prerender = true;

export const GET = async () => {
	const data = await Promise.all(
		Object.entries(import.meta.glob('$lib/notes/*.md')).map(async ([path, page]) => {
			const pagedata = await page();
			const { html } = pagedata.default.render();

			const slug = path.split('/').pop().split('.').shift();
			return { slug, html, path };
		})
	).then((posts) => {
		console.log(posts);
		return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
	});

	return json(data);
};
