import style from './style.module.scss'
import Section from '../Section'
import { useLanguage, useText } from 'src/tools/language'
import { latestReport } from 'src/data/report'
import { formatDate } from 'src/tools/date'
import Vega from 'src/components/Vega'
import texts from 'src/data/text.json?init'
import spec from 'src/data/sankey-w-data.vg'

export default function SankeyChart() {
	const formatter = formatDate(useLanguage())
	const from = formatter('2022-02-24')
	let till = latestReport.till
	if (till === '2023-07-02') till = '2023-07-09'
	till = formatter(till)
	const text = useText()
	const title = text('sankey.title')
	const subtitle = text('sankey.subtitle', { from, till })
	const description = text('sankey.description')
	let json = JSON.stringify(spec)
	Object.entries(texts[useLanguage()].sankey).slice(3).forEach(([key, val]) => {
		json = json.replaceAll(key, val)
	})
	return (
		<Section {...{ title, subtitle, description }} >
			<Vega spec={JSON.parse(json)} className={style.chart} />
		</Section>
	)
}