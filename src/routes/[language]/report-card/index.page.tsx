import style from './style.module.scss'
import { useApp } from 'src/tools/app'
import { useLanguage, useText } from 'src/tools/language'
import { useCountry } from 'src/tools/country'
import { useApi } from '../../../tools/useApiCall'
import { ReportCardResponse } from '../../../api/api-models'
import DataLoader from '../../../components/DataLoader'
import Container from '../../../components/Container'

export default function ReportCard() {
	const language = useLanguage()
	const text = useText()
	const country = useCountry()
	const app = useApp()
	const apiCall = useApi<ReportCardResponse>('/congress/ua_report_card');

	return (<Container className={style.container}>
		<DataLoader isLoading={apiCall.isLoading}>
			<div>Is loading: {apiCall.isLoading ? 'Yes' : 'No'}</div>
			Ukraine Report Card
			{/*{apiCall.data && <div>*/}
			{/*	<pre>*/}
			{/*		{JSON.stringify(apiCall.data, null, 2)}*/}
			{/*	</pre>*/}
			{/*</div>}*/}
		</DataLoader>
	</Container>);
}
