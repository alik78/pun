import style from './style.module.scss'
import { useApp } from 'src/tools/app'
import { useLanguage, useText } from 'src/tools/language'
import { useCountry } from 'src/tools/country'
import { useApi } from '../../../tools/useApiCall'
import { ReportCardBill, ReportCardMember, ReportCardResponse } from '../../../api/api-models'
import DataLoader from '../../../components/DataLoader'
import Container from '../../../components/Container'

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

export default function ReportCard() {
	const language = useLanguage()
	const text = useText()
	const country = useCountry()
	const app = useApp()
	const apiCall = useApi<ReportCardResponse>('/congress/ua_report_card');

	return (<Container className={style.container}>
		<DataLoader isLoading={apiCall.isLoading}>
			{apiCall.data && <table>
				<thead>
					<tr>
						<th>Name</th>
						<th>State/District</th>
						{apiCall.data.bills.map(bill => <th key={bill.id}>
							{bill.title}
						</th>)}
					</tr>
				</thead>
				<tbody>
					{apiCall.data.members.map(member => <tr key={member.member_id}>
						<td>{member.member_short_title} {member.member_name}</td>
						<td>{member.state}{member.district && <span>/{member.district}</span>}</td>
						{apiCall.data!.bills.map(bill => buildMemberBillVote(bill, member))
							.map(vote => <th key={vote.id}>
								<span>
									{vote.position}
								</span>
							</th>)}
					</tr>)}
				</tbody>
			</table>}
		</DataLoader>
	</Container>);
}
