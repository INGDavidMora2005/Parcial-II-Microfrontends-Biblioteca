import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan, NewLoan } from '../../domain/entities/loan.entity';
import { LoanRepository } from '../../domain/repositories/loan.repository';

/**
 * Caso de uso: registrar un préstamo.
 *
 * @remarks
 * Limpia los espacios sobrantes de los textos y delega el registro al puerto
 * `LoanRepository`. Las reglas de negocio (campos obligatorios, formato de fecha)
 * las valida el microservicio. Se registra en los `providers` de `LoansPage`.
 */
@Injectable()
export class CreateLoanUseCase {
  /** Repositorio de préstamos (puerto del dominio) */
  private readonly loanRepository = inject(LoanRepository);

  /**
   * Ejecuta el caso de uso.
   *
   * @param newLoan Datos del préstamo a registrar.
   * @returns Observable que emite el préstamo creado.
   */
  execute(newLoan: NewLoan): Observable<Loan> {
    return this.loanRepository.create({
      bookTitle: newLoan.bookTitle.trim(),
      memberName: newLoan.memberName.trim(),
      dueDate: newLoan.dueDate,
    });
  }
}
