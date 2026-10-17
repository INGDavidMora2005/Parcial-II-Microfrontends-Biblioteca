package uceva.loans.application.usecase;

import uceva.loans.domain.entity.Loan;
import uceva.loans.domain.entity.LoanStatus;
import uceva.loans.domain.exception.InvalidLoanException;
import uceva.loans.domain.repository.LoanRepository;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public class CreateLoanUseCase {

    private final LoanRepository loanRepository;

    public CreateLoanUseCase(LoanRepository loanRepository) {
        this.loanRepository = loanRepository;
    }

    public Loan execute(String bookTitle, String memberName, String dueDate) {
        if (bookTitle == null || bookTitle.isBlank()) {
            throw new InvalidLoanException("El título del libro es obligatorio");
        }
        if (memberName == null || memberName.isBlank()) {
            throw new InvalidLoanException("El nombre del socio es obligatorio");
        }
        if (dueDate == null || dueDate.isBlank()) {
            throw new InvalidLoanException("La fecha de devolución es obligatoria");
        }

        LocalDate loanDate = LocalDate.now();
        LocalDate parsedDueDate = parseDate(dueDate);
        if (parsedDueDate.isBefore(loanDate)) {
            throw new InvalidLoanException("La fecha de devolución no puede ser anterior a hoy");
        }

        Loan loan = new Loan(null, bookTitle.trim(), memberName.trim(), loanDate, parsedDueDate, LoanStatus.ACTIVE);
        return loanRepository.create(loan);
    }

    private LocalDate parseDate(String date) {
        try {
            return LocalDate.parse(date);
        } catch (DateTimeParseException e) {
            throw new InvalidLoanException("La fecha de devolución debe tener el formato YYYY-MM-DD");
        }
    }
}
