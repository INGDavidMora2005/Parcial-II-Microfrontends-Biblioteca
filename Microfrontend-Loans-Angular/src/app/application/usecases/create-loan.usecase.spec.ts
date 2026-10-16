import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Loan } from '../../domain/entities/loan.entity';
import { LoanRepository } from '../../domain/repositories/loan.repository';
import { NEW_LOAN_MOCK } from '../../mocks/loans.mocks';
import { CreateLoanUseCase } from './create-loan.usecase';

describe('CreateLoanUseCase', () => {
  let useCase: CreateLoanUseCase;
  let loanRepository: jest.Mocked<LoanRepository>;
  const createdLoan: Loan = { id: 6, ...NEW_LOAN_MOCK, loanDate: '2026-10-15', status: 'ACTIVE' };

  beforeEach(() => {
    loanRepository = { list: jest.fn(), getById: jest.fn(), create: jest.fn() };

    TestBed.configureTestingModule({
      providers: [CreateLoanUseCase, { provide: LoanRepository, useValue: loanRepository }],
    });
    useCase = TestBed.inject(CreateLoanUseCase);
  });

  it('debería crearse correctamente', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería registrar el préstamo y retornar el préstamo creado', () => {
    loanRepository.create.mockReturnValue(of(createdLoan));

    useCase.execute(NEW_LOAN_MOCK).subscribe((loan) => {
      expect(loan).toEqual(createdLoan);
    });

    expect(loanRepository.create).toHaveBeenCalledWith(NEW_LOAN_MOCK);
  });

  it('debería quitar los espacios sobrantes del libro y del socio', () => {
    loanRepository.create.mockReturnValue(of(createdLoan));

    useCase.execute({ bookTitle: '  Rayuela ', memberName: ' Juan Pablo Devia  ', dueDate: '2026-11-15' }).subscribe();

    expect(loanRepository.create).toHaveBeenCalledWith(NEW_LOAN_MOCK);
  });
});
