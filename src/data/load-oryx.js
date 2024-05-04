import fs from 'fs'
import dayjs from 'dayjs'
import { map } from 'rambda'

import oryx from './oryx.json' with { type: 'json' }

const what = {
	'Towed Artillery': 'Towed Artillery',
	'Self-Propelled Artillery': 'Self-Propelled Artillery',
	'Multiple Rocket Launchers': 'Multiple Launch Rocket System',
	'Self-Propelled Anti-Aircraft Guns': 'Air Defense System',
	'Surface-To-Air Missile Systems': 'Air Defense System',
	'Aircraft': 'Warplane',
	'Helicopters': 'Helicopter',
	'Tanks': 'Tank',
	'Infantry Fighting Vehicles': 'Infantry Fighting Vehicle',
}
const urls = {
	ru: 'https://web.archive.org/web/${date}/https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html',
	ua: 'https://web.archive.org/web/${date}/https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-ukrainian.html',
}
const countries = {
	ru: 'Russia',
	ua: 'Ukraine',
}
const file = `oryx.json`
const empty = Object.fromEntries(Object.values(what).map(what =>
	[what, map(_ => ({ lost: 0, captured: 0 }), countries)]
))

function extract(page, what, country, date) {
	const re = new RegExp(`>${what}[^(]*\\((\\d+),[^)]*?(?:captured: (\\d+))?\\)`)
	const i = page.indexOf(`${countries[country]} - `)
	const match = page.slice(i).match(re)
	if (!match && date >= '2022-03') {
		// console.error(`NO MATCH: ${what}`)
		throw Error(`NO MATCH: ${what}`)
	}
	const [_, lost, captured] = match || [0, 0, 0]
	// console.log(what, { lost, captured })
	return [parseInt(lost), parseInt(captured) || 0]
}

const dates = Object.keys(oryx)
let date = dates[dates.length - 1] || '2022-01-01'
const today = dayjs().format('YYYY-MM-DD')
for (;;) {
	date = dayjs(date).add(1, 'M').endOf('M').format('YYYY-MM-DD')
	console.log(date)
	if (date >= today) break
	const current = structuredClone(empty)
	for (const country in urls) {
		let url = urls[date < '2022-04-20' ? 'ru' : country]
		url = url.replace('${date}', date.replace(/-/g, ''))
		console.log(url)
		const page = await fetch(url, {
			redirect: 'follow',
			follow: 9,
		}).then(x => x.text())
		// fs.writeFileSync('oryx.html', page)
		const rows = Object.entries(what).forEach(([what, category]) => {
			let [lost, captured] = extract(page, what, country, date)
			console.log(country, what, lost, captured)
			current[category][country].lost += +lost
			current[category][country].captured += +captured
		})
	}
	const rows = Object.entries(current).map(([what, x]) =>
		Object.entries(x).map(([country, { lost, captured }]) =>
			[date.substring(0, 7), what, country, lost, captured].join('\t') + '\n'
		).join('')
	).join('')
	oryx[date.substring(0, 7)] = current
	fs.writeFileSync(file, JSON.stringify(oryx, null, '\t'))
}
