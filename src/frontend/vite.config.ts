import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
// import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
	plugins: [/**viteCommonjs(),*/ sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	resolve: {
		preserveSymlinks: true
	},
	ssr: {
		noExternal: ['interpogate_proto']
	},
	optimizeDeps: {
		exclude: ['interpogate_proto']
	},
	// optimizeDeps: {
	// 	include: ['interpogate_proto']
	// },
	build: {
		commonjsOptions: {
			include: [/interpogate_proto/]
		}
	}
});
