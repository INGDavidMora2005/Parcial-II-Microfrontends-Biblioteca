import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LoanRepository } from '../../domain/repositories/loan.repository';
import { LOANS_MOCK } from '../../mocks/loans.mocks';
import { GetLoanByIdUseCase } from './get-loan-by-id.usecase';

describe('GetLoanByIdUseCase', () => {
  let useCase: GetLoanByIdUseCase;
  let loanRepository: jest.Mocked<LoanRepository>;

  beforeEach(() => {
    loanRepository = { list: jest.fn(), getById: jest.fn(), create: jest.fn() };

    TestBed.configureTestingModule({
      providers: [GetLoanByIdUseCase, { provide: LoanRepository, useValue: loanRepository }],
    });
    useCase = TestBed.inject(GetLoanByIdUseCase);
  });

  it('debería crearse correctamente', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería pedir al repositorio el préstamo con el id indicado', () => {
    loanRepository.getById.mockReturnValue(of(LOANS_MOCK[0]));

    useCase.execute(1).subscribe((loan) => {
      expect(loan).toEqual(LOANS_MOCK[0]);
    });

    expect(loanRepository.getById).toHaveBeenCalledWith(1);
  });

  it('debería propagar el error si el préstamo no existe', () => {
    loanRepository.getById.mockReturnValue(throwError(() => ({ status: 404 })));

    useCase.execute(999).subscribe({
      next: () => fail('No debería emitir datos cuando ocurre un error'),
      error: (error) => expect(error.status).toBe(404),
    });
  });
});
