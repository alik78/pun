import style from './style.module.scss'
import { useApp } from 'src/tools/app'
import { useLanguage, useText } from 'src/tools/language'
import { useCountry } from 'src/tools/country'
import { useApi, useApiCached } from '../../../tools/useApiCall'
import { Member as ReportCardMember, Root as ReportCardResponse } from '../../../api/congress-report-card.models'
import DataLoader from '../../../components/DataLoader'
import Container from '../../../components/Container'
import cn from 'clsx'
import { congressMemberDetailsUrl } from '../congress-member/[id].page'
import React from 'react'

function partyShortName(member: ReportCardMember) {
	return member.party == 'D' ? 'Dem' : 'Rep';
}

type MemberBillVotePosition = 'yes' | 'no' | 'nio' | 'na';
type MemberBillVoteFavor = 'yes' | 'no' | 'neutral';

type TableDataColumn = {
	id: string;
	title: string;
	className?: string;
	hideMobile?: boolean;
}
type TableDataCell = {
	className: string[];
	element: JSX.Element;
	hideMobile?: boolean;
}
type TableDataRow = {
	id: string;
	data: ReportCardMember;
	cells: TableDataCell[]
};
type TableData = {
	columns: TableDataColumn[],
	rows: TableDataRow[]
};

function buildTableData(language: string, apiResponse: ReportCardResponse, text: (id: string) => string): TableData {
	return {
		columns: [
			{
				id: 'name',
				title: text('report_card.header_name'),
				className: 'header-name',
				hideMobile: true
			},
			{
				id: 'location',
				title: text('report_card.header_location'),
				className: 'header-location',
				hideMobile: true
			},
			...apiResponse.bills.map<TableDataColumn>(bill => ({
				id: bill.bill_number,
				title: bill.title,
				className: 'header-bill'
			}))
		],
		rows: apiResponse.members.map<TableDataRow>(member => ({
			id: member.member_id,
			data: member,
			cells: [
				{
					className: [],
					hideMobile: true,
					element: <>
						<a href={congressMemberDetailsUrl(member.member_id, language)}>{member.member_short_title} {member.member_name}</a> ({partyShortName(member)})
					</>
				},
				{
					className: ['hide-tablet'],
					hideMobile: true,
					element: <>
						<span>{member.state}</span>
						{member.district && <span>/{member.district}</span>}
					</>
				},
				...apiResponse.bills.map<TableDataCell>(bill => {
					//const uid = `${member.member_id}${bill.bill_number}`;
					const vote = member.bills.find(b => b.bill_number == bill.bill_number);

					if (!vote) {
						return {
							className: ['vote-cell'],
							element: <span>-</span>
						};
					}

					let cellClass: string = 'vote-favor-neutral';
					let cellText: string = text('report_card.vote_not_in_office');;
					let cellIconCharCode: number = 9744;

					if (vote.vote_position == "Yes") {
						cellText = text('report_card.vote_yes');
						cellClass = bill.in_favor == true ? 'vote-favor-positive' : 'vote-favor-negative';
						cellIconCharCode = 9745;
					} else if (vote.vote_position == "No") {
						cellText = text('report_card.vote_no');
						cellClass = bill.in_favor == false ? 'vote-favor-positive' : 'vote-favor-negative';
						cellIconCharCode = 9746;
					}

					return {
						className: ['vote-cell', cellClass],
						element: <>
							<span className={style['vote-cell-icon']} >{String.fromCharCode(cellIconCharCode)}</span>&nbsp;<span>{cellText}</span>
						</>
					};
				})
			]
		}))
	};
}

export default function CongressReportCard() {
	const language = useLanguage()
	const text = useText()
	const country = useCountry()
	const app = useApp()
	const apiCall = useApiCached<ReportCardResponse>('/congress/ua_report_card', 1);

	const tableData = apiCall.data ? buildTableData(language, apiCall.data, text) : null;

	return (<Container className={style.container}>
		<DataLoader isLoading={apiCall.isLoading}>
			{tableData && <>
				{/* Desktop */}
				<table className={style['ua-report-card-table']}>
					<thead>
						<tr>
							{tableData.columns.map(column => <th key={column.title} className={style[column.className || '']}>
								{column.title}
							</th>)}
						</tr>
					</thead>
					<tbody>
						{tableData.rows.map(row => <tr key={row.id}>
							{row.cells.map((cell, index) => <td key={index} className={cn(cell.className.map(x => style[x]))} >
								{cell.element}
							</td>)}
						</tr>)}
					</tbody>
				</table>

				{/* mobile */}
				{tableData.rows.map(row => <a className={style['mobile-link']} key={row.id} href={congressMemberDetailsUrl(row.data.member_id, language)} >
					<section>
						<h5>{row.data.member_short_title} {row.data.member_name} ({partyShortName(row.data)})</h5>

						{tableData.columns.map((column, index) => <React.Fragment key={column.title}>
							{!column.hideMobile && <div>
								<span className={cn(row.cells[index].className.map(x => style[x]))}>{row.cells[index].element}</span>
								<span>{column.title}</span>
							</div>}
						</React.Fragment>)}
					</section>
				</a>)}
			</>}
		</DataLoader>
	</Container>);
}
