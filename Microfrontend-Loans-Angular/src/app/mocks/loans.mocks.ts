import { Loan, NewLoan } from '../domain/entities/loan.entity';

/**
 * Préstamos de ejemplo para pruebas unitarias.
 */
export const LOANS_MOCK: Loan[] = [
  {
    id: 1,
    bookTitle: 'Cien años de soledad',
    memberName: 'David Mora Duque',
    loanDate: '2026-09-20',
    dueDate: '2026-10-04',
    status: 'RETURNED',
  },
  {
    id: 2,
    bookTitle: 'El amor en los tiempos del cólera',
    memberName: 'Juan Diego Rodriguez',
    loanDate: '2026-10-01',
    dueDate: '2026-10-15',
    status: 'ACTIVE',
  },
];

/**
 * Datos de ejemplo para registrar un préstamo en pruebas unitarias.
 */
export const NEW_LOAN_MOCK: NewLoan = {
  bookTitle: 'Rayuela',
  memberName: 'Juan Pablo Devia',
  dueDate: '2026-11-15',
};
