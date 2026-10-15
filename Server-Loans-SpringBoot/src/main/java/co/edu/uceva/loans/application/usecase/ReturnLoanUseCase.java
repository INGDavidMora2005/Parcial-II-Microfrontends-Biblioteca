package co.edu.uceva.loans.application.usecase;

import co.edu.uceva.loans.domain.exception.InvalidLoanException;
import co.edu.uceva.loans.domain.exception.LoanNotFoundException;
import co.edu.uceva.loans.domain.model.Loan;
import co.edu.uceva.loans.domain.repository.LoanRepository;

import java.time.LocalDate;

/**
 * Caso de uso 3: registrar la devolución de un préstamo.
 * Regla: un préstamo ya devuelto no se puede devolver otra vez.
 */
public class ReturnLoanUseCase {

    private final LoanRepository loanRepository;

    public ReturnLoanUseCase(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public Loan execute(Long id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new LoanNotFoundException(id));
        if (loan.isReturned()) {
            throw new InvalidLoanException("El préstamo " + id + " ya fue devuelto");
        }
        loan.markAsReturned(LocalDate.now());
        return loanRepository.save(loan);
    }
}
