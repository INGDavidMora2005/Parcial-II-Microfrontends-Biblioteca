package co.edu.uceva.loans.application.usecase;

import co.edu.uceva.loans.domain.model.Loan;
import co.edu.uceva.loans.domain.repository.LoanRepository;

import java.util.List;

/**
 * Caso de uso 1: listar todos los préstamos.
 */
public class GetAllLoansUseCase {

    private final LoanRepository loanRepository;

    public GetAllLoansUseCase(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public List<Loan> execute() {
        return loanRepository.findAll();
    }
}
