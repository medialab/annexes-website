import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
	plugins: [
		tailwindcss(),
		...(command === 'build'
			? [
					ViteImageOptimizer({
						test: /\.(jpe?g|png|webp|avif|svg)$/i,
						includePublic: true,
						cache: true,
						cacheLocation: '.cache/vite-image-optimizer',
						jpg: {
							quality: 70,
							progressive: true,
							mozjpeg: true
						},
						jpeg: {
							quality: 70,
							progressive: true,
							mozjpeg: true
						},
						png: {
							quality: 72,
							compressionLevel: 9,
							effort: 10,
							palette: true
						},
						webp: {
							quality: 68,
							effort: 6
						},
						avif: {
							quality: 50,
							effort: 9
						},
						svg: {
							multipass: true
						}
					})
				]
			: []),
		sveltekit()
	]
}));
