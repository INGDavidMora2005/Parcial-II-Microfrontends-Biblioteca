import type { Member } from '../../domain/entities/member.entity';
import type { NewMember } from '../../domain/entities/member.entity';
import type { CreateMemberDto, MemberDto } from '../dtos/member.dto';

export class MemberMapper {

  static toEntity(dto: MemberDto): Member {
    return {
      id: dto.id,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone ?? '',
      active: dto.active,
    };
  }

  static toCreateDto(member: NewMember): CreateMemberDto {
    return {
      fullName: member.fullName,
      email: member.email,
      phone: member.phone ?? '',
    };
  }
}
