package uceva.loans.application.usecase;

import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.repository.LoanRepository;

import java.util.List;

public class ListLoansUseCase {

    private final LoanRepository loanRepository;

    public ListLoansUseCase(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public List<Loan> execute() {
        return loanRepository.getAll();
    }
}
