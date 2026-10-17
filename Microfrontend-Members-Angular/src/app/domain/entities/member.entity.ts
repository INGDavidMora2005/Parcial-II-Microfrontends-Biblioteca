/**
 * Socio registrado en la biblioteca.
 * @remarks
 * Entidad de dominio que expone la identidad y el estado del socio.
 */
export interface Member {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  active: boolean;
}

/**
 * Datos necesarios para registrar un socio nuevo.
 */
export interface NewMember {
  fullName: string;
  email: string;
  phone: string;
}
