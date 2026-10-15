package co.edu.uceva.loans.infrastructure.persistence;

import co.edu.uceva.loans.domain.model.Loan;
import co.edu.uceva.loans.domain.model.LoanStatus;
import co.edu.uceva.loans.domain.repository.LoanRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Adaptador de persistencia en memoria.
 * Implementa el puerto LoanRepository del dominio. Arranca con datos de ejemplo.
 */
@Repository
public class InMemoryLoanRepository implements LoanRepository {

    private final Map<Long, Loan> storage = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    public InMemoryLoanRepository() {
        LocalDate today = LocalDate.now();
        save(new Loan(null, 1L, 1L, today.minusDays(5), today.plusDays(10), null, LoanStatus.ACTIVE));
        save(new Loan(null, 2L, 2L, today.minusDays(20), today.minusDays(6), today.minusDays(7), LoanStatus.RETURNED));
    }

    @Override
    public List<Loan> findAll() {
        List<Loan> loans = new ArrayList<>(storage.values());
        loans.sort((a, b) -> a.getId().compareTo(b.getId()));
        return loans;
    }

    @Override
    public Optional<Loan> findById(Long id) {
        return Optional.ofNullable(storage.get(id));
    }

    @Override
    public Loan save(Loan loan) {
        if (loan.getId() == null) {
            loan.setId(sequence.incrementAndGet());
        }
        storage.put(loan.getId(), loan);
        return loan;
    }
}
