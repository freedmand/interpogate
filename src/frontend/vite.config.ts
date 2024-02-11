import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export default defineConfig({
	plugins: [
		sveltekit(),
		purgeCss({
			safelist: {
				greedy: [/^hljs-/] // syntax highlighting
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		preserveSymlinks: true
	},
	ssr: {
		noExternal: ['npy']
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: () => 'main' // bundle everything in one chunk (important for singlefile build)
			}
		}
	}
});
