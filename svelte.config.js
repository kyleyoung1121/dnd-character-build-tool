import adapter from '@sveltejs/adapter-static';
const dev = process.env.NODE_ENV === 'development';

const config = {
	

	kit: {
		adapter: adapter({
			// GitHub Pages needs this if you're hosting at a subpath
			pages: 'build',
			assets: 'build',
			fallback: null
		}),

		prerender: {
			entries: ['*']
		}
	}
};

export default config;
