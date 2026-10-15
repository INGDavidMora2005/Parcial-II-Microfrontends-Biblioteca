export interface Member {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface NewMember {
  fullName: string;
  email: string;
  phone: string;
}
