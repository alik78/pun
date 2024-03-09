import { defineConfig } from 'vite'
import rakkas from 'rakkasjs/vite-plugin'
import unocss from 'unocss/vite'
import { presetUno, transformerDirectives } from 'unocss'
import { presetDaisy } from 'unocss-preset-daisy'
import { presetIcons } from '@unocss/preset-icons'

import countries from './src/data/countries.json'

const viteEnv = {}
Object.entries(process.env).forEach(([key, val]) => {
	if (key.startsWith(`VITE_`)) {
		console.log(key, val)
		viteEnv[`import.meta.env.${key}`] = `'${val}'`
	}
})

export default defineConfig({
	plugins: [
		unocss({
			transformers: [
				transformerDirectives(),
			],
			presets: [
				presetUno(),
				presetDaisy({
					themes: ["light"],
				}),
				presetIcons({
					prefix: 'i-',
					extraProperties: {
						display: 'inline-block',
						'vertical-align': 'text-bottom',
					}
				}),
			],
			safelist: Object.keys(countries).map(c => `i-circle-flags-${c}`),
		}),
		rakkas({
			adapter: 'cloudflare-workers',
		}),
	],
	define: viteEnv,
	resolve: {
		alias: {
			src: '/src',
		},
	},
	//server: {
	//	proxy: {
	//		'/api': {
	//			target: 'http://staging-api.protectukrainenow.org/v1', 
	//			changeOrigin: true,
	//			rewrite: (path) => path.replace(/^\/api/, '')
	//		},
	//	},
	//},
})
