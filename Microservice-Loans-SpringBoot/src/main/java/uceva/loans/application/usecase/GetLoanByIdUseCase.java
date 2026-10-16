package uceva.loans.application.usecase;

import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.exception.LoanNotFoundException;
import uceva.loans.domain.repository.LoanRepository;

public class GetLoanByIdUseCase {

    private final LoanRepository loanRepository;

    public GetLoanByIdUseCase(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public Loan execute(Integer id) {
        return loanRepository.getById(id)
                .orElseThrow(() -> new LoanNotFoundException(id));
    }
}
