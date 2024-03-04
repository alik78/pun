import style from './style.module.scss'
import { useApp } from 'src/tools/app'
import { useLanguage, useText } from 'src/tools/language'
import { useCountry } from 'src/tools/country'
import { useApi } from '../../../tools/useApiCall'
import { ReportCardBill, ReportCardMember, ReportCardResponse } from '../../../api/api-models'
import DataLoader from '../../../components/DataLoader'
import Container from '../../../components/Container'
import { JSXElementConstructor } from 'react'

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
}
type TableDataCell = {
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

function buildTableData(apiResponse: ReportCardResponse): TableData {
	return {
		columns: [
			{ id: 'name', title: 'Name' },
			{ id: 'location', title: 'State/District' },
			...apiResponse.bills.map<TableDataColumn>(bill => ({
				id: bill.bill_number,
				title: bill.title
			}))
		],
		rows: apiResponse.members.map<TableDataRow>(member => ({
			id: member.member_id,
			cells: [
				{
					element: <span>{member.member_short_title} {member.member_name}</span>
				},
				{
					element: <>
						<span>{member.state}</span>
						{member.district && <span>/{member.district}</span>}
					</>
				},
				...apiResponse.bills.map<TableDataCell>(bill => {
					const uid = `${member.member_id}${bill.bill_number}`;
					const vote = member.bills.find(b => b.bill_number == bill.bill_number);

					let element: JSX.Element = <span>N/A</span>;

					return {
						element: element
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

	const tableData = apiCall.data ? buildTableData(apiCall.data) : null;

	return (<Container className={style.container}>
		<DataLoader isLoading={apiCall.isLoading}>
			{tableData && <table>
				<thead>
					<tr>
						{tableData.columns.map(column => <th key={column.title}>
							{column.title}
						</th>)}
					</tr>
				</thead>
				<tbody>
					{tableData.rows.map(row => <tr key={row.id}>
						{row.cells.map((cell, index) => <td key={index}>
							{cell.element}
						</td>)}
					</tr>)}
				</tbody>
			</table>}
		</DataLoader>
	</Container>);
}
