package co.edu.uceva.loans.infrastructure.web.dto;

import co.edu.uceva.loans.domain.model.Loan;

import java.time.LocalDate;

/**
 * Datos de salida de un préstamo (lo que ve el frontend).
 */
public record LoanResponse(
        Long id,
        Long bookId,
        Long memberId,
        LocalDate loanDate,
        LocalDate dueDate,
        LocalDate returnDate,
        String status
) {
    public static LoanResponse fromDomain(Loan loan) {
        return new LoanResponse(
                loan.getId(),
                loan.getBookId(),
                loan.getMemberId(),
                loan.getLoanDate(),
                loan.getDueDate(),
                loan.getReturnDate(),
                loan.getStatus().name());
    }
}
