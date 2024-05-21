import { assocPath, path } from 'rambda'

import balance from './balance.json'
import commits from './commits.json'
import categories from './categories.json'
import { isoDate, DAY } from '../tools/date'

const first = '2022-07-17'
export const latest = '2024-05-19'

let timespan = 14 * DAY
export let Report = till => {
    if (!till) return
    let t = new Date(till).valueOf()
    let from = isoDate(t - timespan + DAY)
    let prev = till > first  && isoDate(t - timespan)
    let next = till < latest && isoDate(t + timespan)
    return { from, till, prev, next }
}
export let latestReport = Report(latest)!

let modify = (p, fn, o) => assocPath(p, fn(path(p, o)), o)
let commitsByCategory = ({ report = latestReport, filter = null } = {}) => {
    let o = commits.reduce((o, r) => {
        let [date, country, category, model, qty, link] = r
        if (date > report.till || (filter && !filter(r))) return o
        let add = x => (x || 0) + +qty
        let idx = country === 'us' ? 0 : 1
        let values = x => modify([idx, 'value'], add, x || [{}, {}])
        o = modify([category, 'values'], values, o)
        if (date >= report.from) {
            o = modify([category, 'values', idx, 'delta'], add, o)
            let sources = x => [...(x || []), { country, model, qty, link }]
            o = modify([category, 'values', idx, 'sources'], sources, o)
        }
        o = modify([category, 'byModel', model, 'qty'], add, o)
        o = modify([category, 'byModel', model, 'byCountry', country], add, o)
        return o
    }, {})
    // console.log(o)
    return o
}

export function incomeReport(report) {
    let byCategory = commitsByCategory({ report })
    return categories.map(category => {
        let cat = byCategory[category]
        cat.byModel = Object.entries(cat.byModel)
        .map(([model, val]) => ({ model, ...val }))
        cat.byModel.sort((a, b) => b.qty - a.qty)
        .forEach(m => {
            m.byCountry = Object.entries(m.byCountry).map(([country, qty]) => ({ country, qty }))
            m.byCountry.sort((a, b) => b.qty - a.qty)
        })
        return {
            category,
            ...byCategory[category],
        }
    })
}

export function balanceReport() {
    return balance.map(({ category, ru, ua, byModel }) => ({
        category,
        values: [{ value: ru }, { value: ua }],
        byModel: byModel.filter(x => (x.ru|0) + (x.ua|0)),
    }))
}

let byCategory = commitsByCategory() // { filter: x => (x[5] || 'PDA') === 'PDA' }
export function inventoryReport() {
    return balance.map(({ category, us, byModel }) => {
        let cat = byCategory[category]
        byModel = byModel.filter(x => +x.us).map(x => ({
            ...x,
            possessed: x.us,
            committed: cat.byModel[x.model]?.byCountry.us,
        }))
        return {
            category,
            values: [{ value: us }, cat.values[0]],
            byModel,
        }
    })
}
