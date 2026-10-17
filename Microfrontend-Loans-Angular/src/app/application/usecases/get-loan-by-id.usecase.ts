import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../../domain/entities/loan.entity';
import { LoanRepository } from '../../domain/repositories/loan.repository';

/**
 * Caso de uso: obtener el detalle de un préstamo por su id.
 *
 * @remarks
 * Solo conoce el puerto `LoanRepository`. Se registra en los `providers` de `LoansPage`.
 */
@Injectable()
export class GetLoanByIdUseCase {
  /** Repositorio de préstamos (puerto del dominio) */
  private readonly loanRepository = inject(LoanRepository);

  /**
   * Ejecuta el caso de uso.
   *
   * @param id Identificador del préstamo.
   * @returns Observable que emite el préstamo encontrado.
   */
  execute(id: number): Observable<Loan> {
    return this.loanRepository.getById(id);
  }
}
