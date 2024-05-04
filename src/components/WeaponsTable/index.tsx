import cn from 'clsx'
import { useState } from 'react'

import style from './style.module.scss'
import IconCell from './IconCell'
import DataCell from './DataCell'
import Section from '../Section'
import { assocPath } from 'rambda'

const WeaponsTable = ({ title, subtitle, head, data, description, Details }) => {
	const [expanded, setExpanded] = useState([])
	// console.log('expanded', expanded)
	const toggle = i => () => {
		console.log('toggle', i)
		setExpanded(assocPath(i + '', !expanded[i], expanded))
	}
	const severalExpanded = expanded.reduce((a, b) => a + (b ? 1 : 0), 0) > 1
	const toggleAll = () => setExpanded(severalExpanded ? [] : data)
	const left = data.slice(0, data.length / 2)
	const right = data.slice(-data.length / 2)

	const headLayout = (
		<div
			className={cn(style.row, style.headRow)}
			onClick={toggleAll}
		>
			<div className={style.head}>
				{Details &&
					<span className={severalExpanded ? 'i-ion-chevron-collapse' : 'i-ion-chevron-expand'} />
				}
			</div>
			{head.map((x, i) => <div className={style.head} key={i}>{x}</div>)}
		</div>
	)

	const rowsRenderer = (row, ix) => {
		let { category, values } = row
		return (
			<div className={style.row} key={ix}>
				<IconCell
					category={category}
					onClick={toggle(ix)}
				/>
				{values.map((x, i) =>
					<DataCell
						className={style.valueCell}
						{...x}
						key={i}
						onClick={toggle(ix)}
					/>
				)}
				{Details && expanded[ix] &&
					<Details {...row} />
				}
			</div>
		)
	}

	const renderTableLayout = (data, ix) => (
		<div className={style.table} key={ix}>
			{headLayout}
			{data.map((row, i) => rowsRenderer(row, ix * data.length + i))}
		</div>
	)

	return (
		<Section {...{ title, subtitle, description, className: style.container }}>
			<div className={style.splitter}>
				{[left, right].map(renderTableLayout)}
			</div>
		</Section>
	)
}

export default WeaponsTable
