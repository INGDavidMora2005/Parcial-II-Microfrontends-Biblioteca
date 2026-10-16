package uceva.loans.application.usecase;

import org.junit.jupiter.api.Test;
import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.entity.LoanStatus;
import uceva.loans.domain.repository.LoanRepository;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ListLoansUseCaseTest {

    @Test
    void shouldReturnAllLoansFromRepository() {
        LoanRepository loanRepository = mock(LoanRepository.class);
        Loan loan = new Loan(1, "Rayuela", "Ana", LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 15), LoanStatus.ACTIVE);
        when(loanRepository.getAll()).thenReturn(List.of(loan));

        List<Loan> result = new ListLoansUseCase(loanRepository).execute();

        assertEquals(1, result.size());
        assertEquals("Rayuela", result.get(0).bookTitle);
    }
}
