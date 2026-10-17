import type { Member } from '../entities/member.entity';
import type { NewMember } from '../entities/member.entity';

/**
 * Puerto del dominio para acceder a los socios.
 * @remarks
 * Es una clase abstracta para poder usarla como token de inyección.
 * La implementación concreta vive en la capa de infraestructura.
 */
export abstract class MemberRepository {
  /** Obtiene todos los socios. */
  abstract findAll(): Promise<Member[]>;

  /** Obtiene un socio por su identificador. */
  abstract findById(id: number): Promise<Member>;

  /** Registra un socio nuevo y retorna el socio creado. */
  abstract create(member: NewMember): Promise<Member>;
}