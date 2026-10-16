package uceva.loans.application.usecase;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.entity.LoanStatus;
import uceva.loans.domain.exception.LoanNotFoundException;
import uceva.loans.domain.repository.LoanRepository;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class GetLoanByIdUseCaseTest {

    private LoanRepository loanRepository;
    private GetLoanByIdUseCase useCase;

    @BeforeEach
    void setUp() {
        loanRepository = mock(LoanRepository.class);
        useCase = new GetLoanByIdUseCase(loanRepository);
    }

    @Test
    void shouldReturnLoanWhenItExists() {
        Loan loan = new Loan(1, "Rayuela", "Ana", LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 15), LoanStatus.ACTIVE);
        when(loanRepository.getById(1)).thenReturn(Optional.of(loan));

        assertEquals(loan, useCase.execute(1));
    }

    @Test
    void shouldThrowWhenLoanDoesNotExist() {
        when(loanRepository.getById(999)).thenReturn(Optional.empty());

        LoanNotFoundException ex = assertThrows(LoanNotFoundException.class, () -> useCase.execute(999));
        assertEquals("No existe un préstamo con id 999", ex.getMessage());
    }
}
