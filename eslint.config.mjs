// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
	settings: {
		'import/resolver': {
			alias: {
				map: [
					['@', './src'],
				],
				extensions: ['.js', '.ts', '.vue'],
			},
		},
	},
});
