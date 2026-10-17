/**
 * Socio tal como lo devuelve el microservicio de Socios.
 */
export interface MemberDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  active: boolean;
}

/**
 * Cuerpo enviado al microservicio para registrar un socio nuevo.
 */
export interface CreateMemberDto {
  fullName: string;
  email: string;
  phone: string;
}
