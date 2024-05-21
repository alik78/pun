import style from './style.module.scss'
import Section from '../Section'
import { useLanguage, useText, useSankey } from 'src/tools/language'
import { latestReport } from 'src/data/report'
import { formatDate } from 'src/tools/date'
import Vega from 'src/components/Vega'
import spec from 'src/data/sankey24-w-data.vg'

export default function Sankey24() {
	const formatter = formatDate(useLanguage())
	const from = formatter('2024-04-24')
	const text = useText()
	const title = text('sankey24.title')
	const subtitle = text('sankey24.subtitle', { from })
	const description = text('sankey24.description')
	return (
		<Section {...{ title, subtitle, description }} >
			<Vega spec={useSankey(spec)} className={style.chart} />
		</Section>
	)
}