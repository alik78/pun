import style from './style.module.scss'
import { useApp } from 'src/tools/app'
import { replaceLanguageInUrl, useLanguage, useText } from 'src/tools/language'
import { useCountry } from 'src/tools/country'
import { useApi, useApiCached } from '../../../tools/useApiCall'
import { CongressMemberResponse, ReportCardBill, ReportCardMember, ReportCardResponse } from '../../../api/report-card.models'
import DataLoader from '../../../components/DataLoader'
import Container from '../../../components/Container'
import cn from 'clsx'

export const congressMemberDetailsUrl = (memberID: string, language: string) => `/${language}/congress-member/${memberID}`;
	//=> `/${language}/congress-member`;
	//=> `/${language}/congress-member/:${memberID}`;

export default function CongressMember({ params }) {
	const language = useLanguage()
	const text = useText()
	const country = useCountry()
	const app = useApp()

	const apiCall = useApiCached<CongressMemberResponse>(`/members/${params.id}`, 3);
	const member = apiCall?.data?.member;

	//const tableData = apiCall.data ? buildTableData(apiCall.data, text) : null;

	return (<Container className={style.container}>
		<DataLoader isLoading={apiCall.isLoading}>
			{member && <>
				MEMBER: {member.first_name} {member.last_name}
			</>}
		</DataLoader>
	</Container>);
}
