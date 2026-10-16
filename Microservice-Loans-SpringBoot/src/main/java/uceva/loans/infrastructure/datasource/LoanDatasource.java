package uceva.loans.infrastructure.datasource;

import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.entity.LoanStatus;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class LoanDatasource {

    private final List<Loan> loans = new ArrayList<>();
    private Integer nextId = 1;

    public LoanDatasource() {
        create(new Loan(null, "Cien años de soledad", "David Mora Duque",
                LocalDate.of(2026, 9, 20), LocalDate.of(2026, 10, 4), LoanStatus.RETURNED));
        create(new Loan(null, "El amor en los tiempos del cólera", "Juan Diego Rodriguez",
                LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 15), LoanStatus.ACTIVE));
        create(new Loan(null, "Don Quijote de la Mancha", "Juan Pablo Devia",
                LocalDate.of(2026, 10, 5), LocalDate.of(2026, 10, 19), LoanStatus.ACTIVE));
        create(new Loan(null, "La María", "Maria Fernanda Lopez",
                LocalDate.of(2026, 9, 28), LocalDate.of(2026, 10, 12), LoanStatus.RETURNED));
        create(new Loan(null, "Rayuela", "Carlos Alberto Ruiz",
                LocalDate.of(2026, 10, 10), LocalDate.of(2026, 10, 24), LoanStatus.ACTIVE));
    }

    public List<Loan> getAll() {
        return new ArrayList<>(loans);
    }

    public Optional<Loan> getById(Integer id) {
        return loans.stream()
                .filter(loan -> loan.id.equals(id))
                .findFirst();
    }

    public Loan create(Loan loan) {
        loan.id = nextId++;
        loans.add(loan);
        return loan;
    }
}
