package uceva.loans.infrastructure.repository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.entity.LoanStatus;
import uceva.loans.infrastructure.datasource.LoanDatasource;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LoanRepositoryImplTest {

    private LoanRepositoryImpl repository;

    @BeforeEach
    void setUp() {
        repository = new LoanRepositoryImpl(new LoanDatasource());
    }

    @Test
    void shouldReturnAllLoansFromDatasource() {
        assertEquals(5, repository.getAll().size());
    }

    @Test
    void shouldFindLoanById() {
        assertTrue(repository.getById(2).isPresent());
        assertFalse(repository.getById(999).isPresent());
    }

    @Test
    void shouldCreateLoanThroughDatasource() {
        Loan loan = new Loan(null, "Rayuela", "Ana", LocalDate.now(), LocalDate.now().plusDays(7), LoanStatus.ACTIVE);

        assertEquals(6, repository.create(loan).id);
        assertEquals(6, repository.getAll().size());
    }
}
