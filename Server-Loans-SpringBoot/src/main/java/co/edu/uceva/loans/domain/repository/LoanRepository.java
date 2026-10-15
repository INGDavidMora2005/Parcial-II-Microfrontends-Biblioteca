package co.edu.uceva.loans.domain.repository;

import co.edu.uceva.loans.domain.model.Loan;

import java.util.List;
import java.util.Optional;

/**
 * Puerto (interfaz) del repositorio de préstamos.
 * La capa de infraestructura provee la implementación.
 */
public interface LoanRepository {

    List<Loan> findAll();

    Optional<Loan> findById(Long id);

    Loan save(Loan loan);
}
