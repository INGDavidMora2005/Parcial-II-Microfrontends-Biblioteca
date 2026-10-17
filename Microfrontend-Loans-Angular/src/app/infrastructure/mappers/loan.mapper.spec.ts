import { LOANS_MOCK, NEW_LOAN_MOCK } from '../../mocks/loans.mocks';
import { LoanDto } from '../dtos/loan.dto';
import { LoanMapper } from './loan.mapper';

describe('LoanMapper', () => {
  it('debería convertir un LoanDto en una entidad Loan', () => {
    const dto: LoanDto = { ...LOANS_MOCK[1] };

    expect(LoanMapper.toEntity(dto)).toEqual(LOANS_MOCK[1]);
  });

  it('debería conservar el estado RETURNED al convertir', () => {
    const dto: LoanDto = { ...LOANS_MOCK[0], status: 'RETURNED' };

    expect(LoanMapper.toEntity(dto).status).toBe('RETURNED');
  });

  it('debería convertir un NewLoan en el cuerpo del POST', () => {
    expect(LoanMapper.toCreateDto(NEW_LOAN_MOCK)).toEqual({
      bookTitle: 'Rayuela',
      memberName: 'Juan Pablo Devia',
      dueDate: '2026-11-15',
    });
  });
});
