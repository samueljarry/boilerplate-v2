import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

	modules: ['@nuxt/eslint'],
	devtools: { enabled: true },
	css: ['~/assets/styles/main.css'],
	compatibilityDate: '2025-05-15',

	vite: {
		plugins: [
			tailwindcss(),
			tsConfigPaths(),
			{
				name: 'force-full-reload',

				handleHotUpdate({ file, server }) {
					if (file.endsWith('.ts')) {
						server.ws.send({
							type: 'full-reload',
							path: 'src/*',
						});
					}
				},
			},
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	},

	eslint: {
		config: {
			stylistic: {
				indent: 'tab',
				semi: true,
			},
		},
	},
});
