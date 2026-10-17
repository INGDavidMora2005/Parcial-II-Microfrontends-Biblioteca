import type { Member } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';

/**
 * Caso de uso: obtener el detalle de un socio por su id.
 * @remarks
 * Valida el id antes de consultar el repositorio.
 */
export class GetMemberByIdUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  /** Obtiene el detalle del socio con el id indicado. */
  async execute(id: number): Promise<Member> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('El id debe ser un número entero positivo');
    }
    return this.memberRepository.findById(id);
  }
}