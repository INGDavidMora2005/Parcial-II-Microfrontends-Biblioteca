import type { Member } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';

/**
 * Caso de uso: listar el catálogo de socios.
 */
export class ListMembersUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  /** Lista todos los socios. */
  execute(): Promise<Member[]> {
    return this.memberRepository.findAll();
  }
}