//https://jvilk.com/MakeTypes/

// Congress Report Card ===============================================
export interface ReportCardResponse {
	bills: ReportCardBill[];
	members: ReportCardMember[];
}

export interface ReportCardBill {
	id: number;
	bill_number: string;
	title: string;
	in_favor: boolean;
}

export interface ReportCardMember {
	member_id: string;
	member_short_title: string;
	member_name: string;
	state: string;
	district?: string;
	bills: ReportCardMemberVote[];
}

export interface ReportCardMemberVote {
	bill_number: string;
	vote_position: string;
}

// Congress Member ========================================================
export interface CongressMemberResponse {
	status: string;
	page: string;
	description: string;
	member: CongressMember;
	meta: CongressMemberMeta;
}
export interface CongressMember {
	id: string;
	title: string;
	short_title: string;
	api_uri: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	suffix?: null;
	date_of_birth: string;
	gender: string;
	party: string;
	leadership_role: string;
	twitter_account: string;
	facebook_account: string;
	youtube_account: string;
	govtrack_id: string;
	cspan_id: string;
	votesmart_id: string;
	icpsr_id: string;
	crp_id: string;
	google_entity_id: string;
	fec_candidate_id: string;
	url: string;
	rss_url?: null;
	contact_form: string;
	in_office: boolean;
	cook_pvi?: null;
	dw_nominate?: null;
	ideal_point?: null;
	seniority: string;
	next_election: string;
	total_votes: number;
	missed_votes: number;
	total_present: number;
	last_updated: string;
	ocd_id: string;
	office: string;
	phone: string;
	fax?: null;
	state: string;
	senate_class: string;
	state_rank: string;
	lis_id: string;
	district?: null;
	at_large?: null;
	geoid?: null;
	missed_votes_pct: number;
	votes_with_party_pct: number;
	votes_against_party_pct: number;
	created_at: string;
	updated_at: string;
}

export interface CongressMemberMeta {
	request_id: string;
	timestamp: string;
	version: string;
}
