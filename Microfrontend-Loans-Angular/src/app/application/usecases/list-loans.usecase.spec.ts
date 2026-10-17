import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoanRepository } from '../../domain/repositories/loan.repository';
import { LOANS_MOCK } from '../../mocks/loans.mocks';
import { ListLoansUseCase } from './list-loans.usecase';

describe('ListLoansUseCase', () => {
  let useCase: ListLoansUseCase;
  let loanRepository: jest.Mocked<LoanRepository>;

  beforeEach(() => {
    loanRepository = { list: jest.fn(), getById: jest.fn(), create: jest.fn() };

    TestBed.configureTestingModule({
      providers: [ListLoansUseCase, { provide: LoanRepository, useValue: loanRepository }],
    });
    useCase = TestBed.inject(ListLoansUseCase);
  });

  it('debería crearse correctamente', () => {
    expect(useCase).toBeTruthy();
  });

  it('debería retornar los préstamos que entrega el repositorio', () => {
    loanRepository.list.mockReturnValue(of(LOANS_MOCK));

    useCase.execute().subscribe((loans) => {
      expect(loans).toEqual(LOANS_MOCK);
    });

    expect(loanRepository.list).toHaveBeenCalledTimes(1);
  });
});
