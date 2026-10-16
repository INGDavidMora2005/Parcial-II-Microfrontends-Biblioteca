package uceva.loans.infrastructure.datasource;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.entity.LoanStatus;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LoanDatasourceTest {

    private LoanDatasource datasource;

    @BeforeEach
    void setUp() {
        datasource = new LoanDatasource();
    }

    @Test
    void shouldStartWithFiveSeedLoansWithConsecutiveIds() {
        assertEquals(5, datasource.getAll().size());
        assertEquals(1, datasource.getAll().get(0).id);
        assertEquals(5, datasource.getAll().get(4).id);
    }

    @Test
    void shouldFindLoanById() {
        assertTrue(datasource.getById(1).isPresent());
        assertEquals("Cien años de soledad", datasource.getById(1).get().bookTitle);
    }

    @Test
    void shouldReturnEmptyWhenIdDoesNotExist() {
        assertFalse(datasource.getById(999).isPresent());
    }

    @Test
    void shouldAssignNextIdWhenCreating() {
        Loan loan = new Loan(null, "Rayuela", "Ana", LocalDate.now(), LocalDate.now().plusDays(7), LoanStatus.ACTIVE);

        Loan created = datasource.create(loan);

        assertEquals(6, created.id);
        assertEquals(6, datasource.getAll().size());
    }
}
