import style from './style.module.scss'
import { useApp } from 'src/tools/app'
import { useLanguage, useText } from 'src/tools/language'
import { useCountry } from 'src/tools/country'
import { useApi } from '../../../tools/useApiCall'
import { ReportCardBill, ReportCardMember, ReportCardResponse } from '../../../api/api-models'
import DataLoader from '../../../components/DataLoader'
import Container from '../../../components/Container'
import { JSXElementConstructor } from 'react'
import cn from 'clsx'

type MemberBillVotePosition = 'yes' | 'no' | 'nio' | 'na';
type MemberBillVoteFavor = 'yes' | 'no' | 'neutral';

type MemberBillVote = {
	id: string;
	position: MemberBillVotePosition;
	favor: MemberBillVoteFavor;
};

function buildMemberBillVote(bill: ReportCardBill, member: ReportCardMember): MemberBillVote {
	const uid = `${member.member_id}${bill.bill_number}`;
	const vote = member.bills.find(b => b.bill_number == bill.bill_number);
	if (!vote) {
		return { id: uid, position: 'na', favor: 'neutral' };
	}

	let positionValue: MemberBillVotePosition = 'na';
	switch (vote.vote_position) {
		case 'Yes':
			positionValue = 'yes';
			break;
		case 'No':
			positionValue = 'no';
			break;
		case 'Not In Office':
			positionValue = 'nio';
			break;
	}

	let favorValue: MemberBillVoteFavor = 'neutral';
	if (bill.in_favor === true) {
		favorValue = 'yes';
	} else if (bill.in_favor === false) {
		favorValue = 'no';
	}

	return {
		id: uid,
		position: positionValue,
		favor: favorValue
	};
}

type TableDataColumn = {
	id: string;
	title: string;
	className?: string;
}
type TableDataCell = {
	className: string[];
	element: JSX.Element;
}
type TableDataRow = {
	id: string;
	cells: TableDataCell[]
};
type TableData = {
	columns: TableDataColumn[],
	rows: TableDataRow[]
};

function buildTableData(apiResponse: ReportCardResponse, text: (id: string) => string): TableData {
	return {
		columns: [
			{ id: 'name', title: 'Name', className: 'header-name' },
			{ id: 'location', title: 'State/District', className: 'header-location' },
			...apiResponse.bills.map<TableDataColumn>(bill => ({				
				id: bill.bill_number,
				title: bill.title,
				className: 'header-bill'
			}))
		],
		rows: apiResponse.members.map<TableDataRow>(member => ({
			id: member.member_id,
			cells: [
				{
					className:[],
					element: <>
						<span>{member.member_short_title} {member.member_name}</span>
					</>
				},
				{
					className: [],
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
							element: <span>N/A</span>
						};
					}

					let cellClass: string = 'vote-favor-neutral';
					let cellText: string = 'Not In Office';
					let cellIconCharCode: number = 9744;

					if (vote.vote_position == "Yes") {
						cellText = 'Aye';
						cellClass = bill.in_favor == true ? 'vote-favor-positive' : 'vote-favor-negative';
						cellIconCharCode = 9745;
					} else if (vote.vote_position == "No") {
						cellText = 'No';
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

export default function ReportCard() {
	const language = useLanguage()
	const text = useText()
	const country = useCountry()
	const app = useApp()
	const apiCall = useApi<ReportCardResponse>('/congress/ua_report_card');

	const tableData = apiCall.data ? buildTableData(apiCall.data, text) : null;

	return (<Container className={style.container}>
		<DataLoader isLoading={apiCall.isLoading}>
			{tableData && <table className={style['ua-report-card-table']}>
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
			</table>}
		</DataLoader>
	</Container>);
}
