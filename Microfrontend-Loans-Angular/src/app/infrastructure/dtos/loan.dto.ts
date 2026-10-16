/**
 * Forma exacta en que el microservicio envía un préstamo (JSON).
 *
 * @remarks
 * Es un detalle de infraestructura: si la API cambia, solo cambian el DTO
 * y el mapper, y el dominio queda igual.
 */
export interface LoanDto {
  /** Identificador del préstamo */
  id: number;

  /** Título del libro */
  bookTitle: string;

  /** Nombre del socio */
  memberName: string;

  /** Fecha del préstamo (YYYY-MM-DD) */
  loanDate: string;

  /** Fecha límite de devolución (YYYY-MM-DD) */
  dueDate: string;

  /** Estado del préstamo tal como lo envía la API */
  status: string;
}

/**
 * Cuerpo que espera el microservicio en `POST /api/loans`.
 */
export interface CreateLoanDto {
  /** Título del libro */
  bookTitle: string;

  /** Nombre del socio */
  memberName: string;

  /** Fecha límite de devolución (YYYY-MM-DD) */
  dueDate: string;
}
