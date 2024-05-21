// https://transform.tools/json-to-typescript

export interface Root {
	status: string
	page: string
	description: string
	member: Member
	member_votes: MemberVote[]
	meta: Meta
}

export interface Member {
	id: string
	title: string
	short_title: string
	api_uri: string
	first_name: string
	middle_name: string
	last_name: string
	suffix: any
	date_of_birth: string
	gender: string
	party: string
	leadership_role: any
	twitter_account: string
	facebook_account: string
	youtube_account: string
	govtrack_id: string
	cspan_id: string
	votesmart_id: string
	icpsr_id: string
	crp_id: string
	google_entity_id: string
	fec_candidate_id: string
	url: string
	rss_url: string
	contact_form: any
	in_office: boolean
	cook_pvi: any
	dw_nominate: any
	ideal_point: any
	seniority: string
	next_election: string
	total_votes: number
	missed_votes: number
	total_present: number
	last_updated: string
	ocd_id: string
	office: string
	phone: string
	fax: any
	state: string
	senate_class: any
	state_rank: any
	lis_id: any
	district: string
	at_large: boolean
	geoid: string
	missed_votes_pct: number
	votes_with_party_pct: number
	votes_against_party_pct: number
	created_at: string
	updated_at: string
}

export interface MemberVote {
	bill_number: string
	roll_call: number
	bill_short_title: string
	date: string
	vote_position: string
}

export interface Meta {
	request_id: string
	timestamp: string
	version: string
}
