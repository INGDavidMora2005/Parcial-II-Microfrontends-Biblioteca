import type { Member, NewMember } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';

/**
 * Caso de uso: registrar un socio nuevo.
 * @remarks
 * Valida los datos antes de enviarlos al repositorio.
 */
export class CreateMemberUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  /** Registra un socio nuevo tras validar sus datos. */
  async execute(member: NewMember): Promise<Member> {
    if (!member.fullName || !member.fullName.trim()) {
      throw new Error('El nombre completo es obligatorio');
    }
    if (!member.email || !member.email.trim()) {
      throw new Error('El correo electrónico es obligatorio');
    }
    if (!member.email.includes('@')) {
      throw new Error('El correo electrónico debe contener "@"');
    }
    return this.memberRepository.create(member);
  }
}