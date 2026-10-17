package uceva.loans.application.usecase;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.entity.LoanStatus;
import uceva.loans.domain.exception.InvalidLoanException;
import uceva.loans.domain.repository.LoanRepository;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CreateLoanUseCaseTest {

    private LoanRepository loanRepository;
    private CreateLoanUseCase useCase;
    private final String futureDate = LocalDate.now().plusDays(15).toString();

    @BeforeEach
    void setUp() {
        loanRepository = mock(LoanRepository.class);
        when(loanRepository.create(any(Loan.class))).thenAnswer(invocation -> {
            Loan loan = invocation.getArgument(0);
            loan.id = 6;
            return loan;
        });
        useCase = new CreateLoanUseCase(loanRepository);
    }

    @Test
    void shouldCreateActiveLoanWithTodayAsLoanDate() {
        Loan loan = useCase.execute("  Rayuela ", " Ana ", futureDate);

        assertEquals(6, loan.id);
        assertEquals("Rayuela", loan.bookTitle);
        assertEquals("Ana", loan.memberName);
        assertEquals(LocalDate.now(), loan.loanDate);
        assertEquals(LocalDate.parse(futureDate), loan.dueDate);
        assertEquals(LoanStatus.ACTIVE, loan.status);
        verify(loanRepository).create(any(Loan.class));
    }

    @Test
    void shouldAcceptTodayAsDueDate() {
        Loan loan = useCase.execute("Rayuela", "Ana", LocalDate.now().toString());

        assertEquals(LocalDate.now(), loan.dueDate);
    }

    @Test
    void shouldRejectMissingBookTitle() {
        assertInvalid(null, "Ana", futureDate, "El título del libro es obligatorio");
        assertInvalid("  ", "Ana", futureDate, "El título del libro es obligatorio");
    }

    @Test
    void shouldRejectMissingMemberName() {
        assertInvalid("Rayuela", null, futureDate, "El nombre del socio es obligatorio");
        assertInvalid("Rayuela", "", futureDate, "El nombre del socio es obligatorio");
    }

    @Test
    void shouldRejectMissingDueDate() {
        assertInvalid("Rayuela", "Ana", null, "La fecha de devolución es obligatoria");
        assertInvalid("Rayuela", "Ana", " ", "La fecha de devolución es obligatoria");
    }

    @Test
    void shouldRejectDueDateWithWrongFormat() {
        assertInvalid("Rayuela", "Ana", "15-11-2026", "La fecha de devolución debe tener el formato YYYY-MM-DD");
    }

    @Test
    void shouldRejectDueDateBeforeToday() {
        String yesterday = LocalDate.now().minusDays(1).toString();
        assertInvalid("Rayuela", "Ana", yesterday, "La fecha de devolución no puede ser anterior a hoy");
    }

    private void assertInvalid(String bookTitle, String memberName, String dueDate, String expectedMessage) {
        InvalidLoanException ex = assertThrows(InvalidLoanException.class,
                () -> useCase.execute(bookTitle, memberName, dueDate));
        assertEquals(expectedMessage, ex.getMessage());
        verify(loanRepository, never()).create(any(Loan.class));
    }
}
