import style from './style.module.scss'
import { useApp } from 'src/tools/app'
import { replaceLanguageInUrl, useLanguage, useText } from 'src/tools/language'
import { useCountry } from 'src/tools/country'
import { useApi, useApiCached } from '../../../tools/useApiCall'
import { CongressMemberResponse, ReportCardBill, ReportCardMember, ReportCardResponse } from '../../../api/report-card.models'
import DataLoader from '../../../components/DataLoader'
import Container from '../../../components/Container'
import cn from 'clsx'

const schemaCropString = '://';
const cropSchemaPart = (url: string) => url.indexOf(schemaCropString) >= 0 ? url.substring(url.indexOf(schemaCropString) + schemaCropString.length) : url;

export const congressMemberDetailsUrl = (memberID: string, language: string) => `/${language}/congress-member/${memberID}`;

export default function CongressMember({ params }) {
	const language = useLanguage()
	const text = useText()
	const country = useCountry()
	const app = useApp()

	const apiCall = useApiCached<CongressMemberResponse>(`/members/${params.id}`, 3);
	const member = apiCall?.data?.member;

	return (<Container className={style.container}>
		<DataLoader isLoading={apiCall.isLoading}>
			{member && <>
				<div className={style['header']} >
					<h2>{member.title}</h2>
					<h1>{member.first_name} {member.last_name}</h1>

					{member.party == 'D' && <p>Democratic Party</p>}
					{member.party == 'R' && <p>Republican Party</p>}
				</div>

				<div className={style['member-content']}>

					<section className={style['content']}>
						<h2>Vote statistics</h2>

						<p>
							{member.total_votes && <>
								<strong>Total votes</strong>
								<span>{member.total_votes}</span>					
							</>}
							{member.missed_votes && <>
								<strong>Missed votes</strong>
								<span>{member.missed_votes_pct}%</span>
							</>}
							{member.votes_with_party_pct && <>
								<strong>Votes with party</strong>
								<span>{member.votes_with_party_pct}%</span>
							</>}
							{member.votes_against_party_pct && <>
								<strong>Votes against party</strong>
								<span>{member.votes_against_party_pct}%</span>
							</>}
						</p>
					</section>

					<section className={style['contact']}>
						<h2>Contact Information</h2>
						<p>
							{member.url && <>
								<strong>Profile</strong>
								<span><a target="_blank" href={member.url}>{cropSchemaPart(member.url)}</a></span>
							</>}
							{member.phone && <>
								<strong>Phone</strong>
								<a href={`tel:${member.phone}`}>{member.phone}</a>
							</>}
							{member.office && <>
								<strong>Office</strong>
								<span>{member.office}</span>
							</>}
						</p>

						<div className={style['social-media']}>
							{member.youtube_account && <a href={`https://youtube.com/@${member.youtube_account}`} target="_blank" className="icon"><i className="fab fa-youtube"></i></a>}
							{member.twitter_account && <a href={`https://twitter.com/${member.twitter_account}`} target="_blank" className="icon"><i className="fab fa-twitter"></i></a>}
							{member.facebook_account && <a href={`https://facebook.com/${member.facebook_account}`} target="_blank" className="icon"><i className="fab fa-facebook-f"></i></a>}
						</div>
					</section>
				</div>
			</>}
		</DataLoader>
	</Container>);
}
