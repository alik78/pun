import style from './style.module.scss'
import Section from '../Section'
import { useLanguage, useText, useSankey } from 'src/tools/language'
import { latestReport } from 'src/data/report'
import { formatDate } from 'src/tools/date'
import Vega from 'src/components/Vega'
import spec from 'src/data/sankeyMilitary-w-data.vg'

export default function SankeyMilitary() {
	const formatter = formatDate(useLanguage())
	const from = formatter('2022-02-24')
	let till = latestReport.till
	if (till === '2023-07-02') till = '2023-07-09'
	till = formatter(till)
	const text = useText()
	const title = text('sankey-military.title')
	const subtitle = text('sankey-military.subtitle', { from, till })
	const description = text('sankey-military.description')
	return (
		<Section {...{ title, subtitle, description }} >
			<Vega spec={useSankey(spec)} className={style.chart} />
		</Section>
	)
}