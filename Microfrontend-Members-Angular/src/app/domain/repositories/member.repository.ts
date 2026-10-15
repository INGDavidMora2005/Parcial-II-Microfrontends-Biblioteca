import type { Member } from '../entities/member.entity';
import type { NewMember } from '../entities/member.entity';

export abstract class MemberRepository {
  abstract getAll(): Promise<Member[]>;
  abstract getById(id: number): Promise<Member>;
  abstract create(member: NewMember): Promise<Member>;
}
