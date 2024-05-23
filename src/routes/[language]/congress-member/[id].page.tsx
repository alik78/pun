import style from './style.module.scss'
import { useApp } from 'src/tools/app'
import { replaceLanguageInUrl, useLanguage, useText } from 'src/tools/language'
import { useCountry } from 'src/tools/country'
import { useApi, useApiCached } from '../../../tools/useApiCall'
import DataLoader from '../../../components/DataLoader'
import Container from '../../../components/Container'
import cn from 'clsx'
import { Root as CongressMemberResponse } from '../../../api/congress-member.models'
import React from 'react'
import VotePosition from '../../../components/VotePosition'

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
	const memberVotes = (apiCall?.data?.member_votes || []);

	return (
		<DataLoader isLoading={apiCall.isLoading}>
			{member && <>
				<Container className={style.container}>
					<div className={style['header']} >
						<h3>{member.title}</h3>
						<h1>{member.first_name} {member.last_name}</h1>

						{member.party == 'D' && <p>Democratic Party</p>}
						{member.party == 'R' && <p>Republican Party</p>}
					</div>

					<div className={style['member-content']}>
						<section className={style['content']}>
							<h2>Member Votes</h2>
							<div className={style['member-votes']}>
								{memberVotes.map(vote => <React.Fragment key={vote.bill_number}>
									<span className={style['bill-number']}>{vote.bill_number}</span>
									<span className={style['bill-title']}>{vote.bill_short_title}</span>
									<VotePosition value={vote.vote_position} />
								</React.Fragment>)}
							</div>
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

				</Container>
			</>}
		</DataLoader >
	);
}
