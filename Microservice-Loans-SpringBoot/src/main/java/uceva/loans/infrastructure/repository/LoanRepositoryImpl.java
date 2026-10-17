package uceva.loans.infrastructure.repository;

import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.repository.LoanRepository;
import uceva.loans.infrastructure.datasource.LoanDatasource;

import java.util.List;
import java.util.Optional;

public class LoanRepositoryImpl extends LoanRepository {

    private final LoanDatasource loanDatasource;

    public LoanRepositoryImpl(LoanDatasource loanDatasource) {
        this.loanDatasource = loanDatasource;
    }

    @Override
    public List<Loan> getAll() {
        return loanDatasource.getAll();
    }

    @Override
    public Optional<Loan> getById(Integer id) {
        return loanDatasource.getById(id);
    }

    @Override
    public Loan create(Loan loan) {
        return loanDatasource.create(loan);
    }
}
