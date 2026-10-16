export interface MemberDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface CreateMemberDto {
  fullName: string;
  email: string;
  phone: string;
}
