package co.edu.uceva.loans.application.usecase;

import co.edu.uceva.loans.domain.exception.InvalidLoanException;
import co.edu.uceva.loans.domain.model.Loan;
import co.edu.uceva.loans.domain.repository.LoanRepository;

import java.time.LocalDate;

/**
 * Caso de uso 2: registrar un nuevo préstamo.
 * Regla: la fecha de devolución no puede ser anterior a hoy.
 */
public class CreateLoanUseCase {

    private final LoanRepository loanRepository;

    public CreateLoanUseCase(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public Loan execute(Long bookId, Long memberId, LocalDate dueDate) {
        if (dueDate.isBefore(LocalDate.now())) {
            throw new InvalidLoanException("La fecha de devolución no puede ser anterior a hoy");
        }
        return loanRepository.save(Loan.create(bookId, memberId, dueDate));
    }
}
