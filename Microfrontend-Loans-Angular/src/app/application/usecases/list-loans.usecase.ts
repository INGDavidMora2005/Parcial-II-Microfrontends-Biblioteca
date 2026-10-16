import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../../domain/entities/loan.entity';
import { LoanRepository } from '../../domain/repositories/loan.repository';

/**
 * Caso de uso: listar préstamos.
 *
 * @remarks
 * Solo conoce el puerto `LoanRepository`; no sabe si los datos vienen de HTTP,
 * de memoria o de otra fuente. No usa `providedIn: 'root'`: se registra en los
 * `providers` de `LoansPage`.
 */
@Injectable()
export class ListLoansUseCase {
  /** Repositorio de préstamos (puerto del dominio) */
  private readonly loanRepository = inject(LoanRepository);

  /**
   * Ejecuta el caso de uso.
   *
   * @returns Observable que emite la lista de préstamos.
   */
  execute(): Observable<Loan[]> {
    return this.loanRepository.list();
  }
}
