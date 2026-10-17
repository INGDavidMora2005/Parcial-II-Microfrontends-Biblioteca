import type { Member } from '../../domain/entities/member.entity';
import type { NewMember } from '../../domain/entities/member.entity';
import type { CreateMemberDto, MemberDto } from '../dtos/member.dto';

/**
 * Convierte entre los DTOs de infraestructura y las entidades de dominio.
 */
export class MemberMapper {

  /** Convierte un DTO en entidad, normalizando teléfono nulo a cadena vacía. */
  static toEntity(dto: MemberDto): Member {
    return {
      id: dto.id,
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone ?? '',
      active: dto.active,
    };
  }

  /** Convierte un socio nuevo en el DTO de creación, normalizando teléfono nulo. */
  static toCreateDto(member: NewMember): CreateMemberDto {
    return {
      fullName: member.fullName,
      email: member.email,
      phone: member.phone ?? '',
    };
  }
}
