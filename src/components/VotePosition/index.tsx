import cn from 'clsx'
import style from './style.module.scss'
import { useLanguage, useText } from 'src/tools/language'
import { balanceReport } from 'src/data/report'
import { formatDate } from 'src/tools/date'
import WeaponsTable from '../WeaponsTable'
import { Fragment } from 'react'

function getValueText(value, languageText) {
	return value;
}

function getValueIcon(value) {
	let cellIconCharCode: number = 9744;

	if (value == "Yes") {
		cellIconCharCode = 9745;
	} else if (value == "No") {
		cellIconCharCode = 9746;
	}
	return String.fromCharCode(cellIconCharCode)
}

export default function VotePosition({value}) {
	//const language = useLanguage()
	const text = useText()

	const voteText = getValueText(value, text);
	const voteIcon = getValueIcon(value);

	return <span className={style['vote-value']}>
		<span className={style['vote-value-icon']}>{voteIcon}</span>&nbsp;<span>{voteText}</span>
	</span>;
}
