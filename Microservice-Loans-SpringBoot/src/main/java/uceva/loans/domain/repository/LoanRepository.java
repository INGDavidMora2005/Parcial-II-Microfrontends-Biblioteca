package uceva.loans.domain.repository;

import uceva.loans.domain.entity.Loan;

import java.util.List;
import java.util.Optional;

public abstract class LoanRepository {
    public abstract List<Loan> getAll();
    public abstract Optional<Loan> getById(Integer id);
    public abstract Loan create(Loan loan);
}
