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
