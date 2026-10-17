import { Observable } from 'rxjs';
import { Loan, NewLoan } from '../entities/loan.entity';

/**
 * Puerto del repositorio de préstamos.
 *
 * @remarks
 * Es una clase abstracta: define **qué** operaciones existen, pero no **cómo**
 * se hacen. Los casos de uso dependen de esta clase y nunca de su implementación.
 * La implementación concreta (`LoanApiGateway`) vive en la capa de infraestructura
 * y se enlaza en los `providers` de `LoansPage`.
 */
export abstract class LoanRepository {
  /**
   * Obtiene todos los préstamos.
   *
   * @returns Observable que emite la lista de préstamos.
   */
  abstract list(): Observable<Loan[]>;

  /**
   * Obtiene un préstamo por su identificador.
   *
   * @param id Identificador del préstamo.
   * @returns Observable que emite el préstamo encontrado.
   */
  abstract getById(id: number): Observable<Loan>;

  /**
   * Registra un préstamo nuevo.
   *
   * @param newLoan Datos del préstamo a registrar.
   * @returns Observable que emite el préstamo creado.
   */
  abstract create(newLoan: NewLoan): Observable<Loan>;
}
