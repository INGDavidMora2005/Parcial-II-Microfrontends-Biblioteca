package co.edu.uceva.loans.application.usecase;

import co.edu.uceva.loans.domain.exception.InvalidLoanException;
import co.edu.uceva.loans.domain.exception.LoanNotFoundException;
import co.edu.uceva.loans.domain.model.Loan;
import co.edu.uceva.loans.domain.model.LoanStatus;
import co.edu.uceva.loans.infrastructure.persistence.InMemoryLoanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

class LoanUseCasesTest {

    private InMemoryLoanRepository repository;

    @BeforeEach
    void setUp() {
        repository = new InMemoryLoanRepository();
    }

    @Test
    void getAllReturnsSeedLoans() {
        assertEquals(2, new GetAllLoansUseCase(repository).execute().size());
    }

    @Test
    void createSavesActiveLoan() {
        Loan loan = new CreateLoanUseCase(repository).execute(5L, 3L, LocalDate.now().plusDays(7));
        assertNotNull(loan.getId());
        assertEquals(LoanStatus.ACTIVE, loan.getStatus());
        assertEquals(3, repository.findAll().size());
    }

    @Test
    void createRejectsPastDueDate() {
        CreateLoanUseCase useCase = new CreateLoanUseCase(repository);
        assertThrows(InvalidLoanException.class,
                () -> useCase.execute(5L, 3L, LocalDate.now().minusDays(1)));
    }

    @Test
    void returnMarksLoanAsReturned() {
        Loan loan = new ReturnLoanUseCase(repository).execute(1L);
        assertEquals(LoanStatus.RETURNED, loan.getStatus());
        assertNotNull(loan.getReturnDate());
    }

    @Test
    void returnFailsWhenAlreadyReturned() {
        ReturnLoanUseCase useCase = new ReturnLoanUseCase(repository);
        assertThrows(InvalidLoanException.class, () -> useCase.execute(2L));
    }

    @Test
    void returnFailsWhenNotFound() {
        ReturnLoanUseCase useCase = new ReturnLoanUseCase(repository);
        assertThrows(LoanNotFoundException.class, () -> useCase.execute(99L));
    }
}
