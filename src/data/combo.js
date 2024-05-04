import fs from 'fs'

import balance from './balance.json' with { type: 'json' }
import commits from './commits.json' with { type: 'json' }
import oryx from './oryx.json' with { type: 'json' }

const vs = {
	ru: 'ua',
	ua: 'ru',
}

const file = `combo.tsv`

let balance2 = balance.flatMap(b => Object.keys(vs).map(country => {
	const x = b.byModel.reduce((a, v) => {
		let x = ~v.model.indexOf('(in store)') ? 0 : v[country] || 0
		console.log(b.category, country, v.model, v[country], x)
		return a + x
	}, 0)
	console.log(['2022-01', b.category, country, x])
	return ['2022-01', b.category, country, x]
}))

commits.forEach(([date, country, category, model, qty]) => {
	const month = date.substr(0, 7)
	oryx[month][category].ua.provided = (oryx[month][category].ua.provided || 0) + qty
})

let next
Object.values(oryx).reverse().forEach(x => {
	Object.entries(x).forEach(([category, { ru, ua }]) => {
		if (ru.lost > next?.[category].ru.lost) {
			ru.lost = next[category].ru.lost
		}
		if (ua.lost > next?.[category].ua.lost) {
			ua.lost = next[category].ua.lost
		}
		if (ru.captured > next?.[category].ru.captured) {
			ru.captured = next[category].ru.captured
		}
		if (ua.captured > next?.[category].ua.captured) {
			ua.captured = next[category].ua.captured
		}
	})
	next = x
})

let prev
Object.values(oryx).forEach(x => {
	Object.entries(x).forEach(([category, { ru, ua }]) => {
		if (category === 'Tank') console.log(prev?.[category])
		ru.lost2 = Math.max(0, ru.lost - (prev?.[category].ru.lost || 0))
		ua.lost2 = Math.max(0, ua.lost - (prev?.[category].ua.lost || 0))
		ru.captured2 = Math.max(0, ua.captured - (prev?.[category].ua.captured || 0))
		ua.captured2 = Math.max(0, ru.captured - (prev?.[category].ru.captured || 0))
    })
	prev = x
})

let combo = Object.entries(oryx).flatMap(([month, x]) =>
	Object.entries(x).flatMap(([category, y]) =>
		Object.entries(y).map(([country, z]) =>
			[month, category, country, , -z.lost2, z.captured2, z.provided]
		)
	)
)

const header = 'month\tcategory\tcountry\thad\tlost\tcaptured\tprovided\n'
const rows = [...balance2, ...combo].map(x => x.join('\t')).join('\n')
fs.writeFileSync(file, header + rows)
