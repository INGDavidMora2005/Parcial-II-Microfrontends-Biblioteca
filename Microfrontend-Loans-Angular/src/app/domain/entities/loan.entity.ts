/**
 * Estados posibles de un préstamo.
 *
 * @remarks
 * - `ACTIVE`: el libro está prestado y aún no se devuelve.
 * - `RETURNED`: el libro ya fue devuelto.
 *
 * @example
 * ```ts
 * const status: LoanStatus = 'ACTIVE';
 * ```
 */
export type LoanStatus = 'ACTIVE' | 'RETURNED';

/**
 * Entidad que representa un préstamo de un libro a un socio.
 *
 * @remarks
 * Es parte del dominio, por eso no depende de Angular ni de HTTP.
 * Las fechas se manejan como texto en formato ISO `YYYY-MM-DD`.
 *
 * @example
 * ```ts
 * const loan: Loan = {
 *   id: 1,
 *   bookTitle: 'Cien años de soledad',
 *   memberName: 'Juan Pablo Devia',
 *   loanDate: '2026-10-15',
 *   dueDate: '2026-10-30',
 *   status: 'ACTIVE',
 * };
 * ```
 */
export interface Loan {
  /** Identificador único del préstamo */
  id: number;

  /** Título del libro prestado */
  bookTitle: string;

  /** Nombre del socio que recibió el libro */
  memberName: string;

  /** Fecha en que se hizo el préstamo (YYYY-MM-DD) */
  loanDate: string;

  /** Fecha límite de devolución (YYYY-MM-DD) */
  dueDate: string;

  /** Estado actual del préstamo */
  status: LoanStatus;
}

/**
 * Datos necesarios para registrar un préstamo nuevo.
 *
 * @remarks
 * No incluye `id`, `loanDate` ni `status`, porque los asigna el microservicio.
 */
export interface NewLoan {
  /** Título del libro que se va a prestar */
  bookTitle: string;

  /** Nombre del socio que recibe el libro */
  memberName: string;

  /** Fecha límite de devolución (YYYY-MM-DD) */
  dueDate: string;
}
