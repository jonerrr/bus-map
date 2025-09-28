import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3055',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '')
			},
			'/m': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/m/, '')
			}
		}
	}
});
