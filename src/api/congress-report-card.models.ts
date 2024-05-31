// https://transform.tools/json-to-typescript
// http://api.staging.protectukrainenow.org/v1/congress/ua_report_card

export interface Root {
	request: Request
	bills: Bill[]
	members: Member[]
}

export interface Request {
	status: string
	page: string
	description: string
}

export interface Bill {
	id: number
	bill_number: string
	title: string
	in_favor: boolean
}

export interface Member {
	member_id: string
	member_short_title: string
	member_name: string
	state: string
	district?: string
	party: string
	bills: Bill2[]
}

export interface Bill2 {
	bill_number: string
	vote_position: string
}
