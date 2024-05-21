import { useLocation } from 'rakkasjs'
import { path } from 'rambda'

import text from '../data/text.json'
import { useApp } from './app'

export function useLanguage() {
	const { current } = useLocation()
	return current.pathname.split('/')[1] || 'en'
}

export function useText() {
	const lang = useLanguage()
	const app = useApp()
	return (id: string, values: object = {}) => {
		const idApp = `${app}/${id}`
		let translation: string = (
			path(idApp.split('.'), text[lang])
			??
			path(id.split('.'), text[lang])
			??
			path(idApp.split('.'), text.en)
			??
			path(id.split('.'), text.en)
			??
			id
		)
		Object.entries(values).forEach(([key, val]) => {
			translation = translation.replace(`{{${key}}}`, val)
		})
		// console.log(`[${app}/${lang}] text(${id})\t-> `, translation.slice(0, 90).replace(/\n/g, ' '))
		return translation
	}
}

export function replaceLanguageInUrl(url, language) {
	const a = url.split('/')
	a[1] = language
	return a.join('/')
}

export function useSankey(spec) {
	let json = JSON.stringify(spec)
	Object.entries(text[useLanguage()].sankey).slice(3).forEach(([key, val]) => {
		json = json.replaceAll(key, `\\"${val.replaceAll('"', '\\\\"')}\\"`)
		// json = json.replaceAll(key, val)
	})
	return JSON.parse(json)
}
