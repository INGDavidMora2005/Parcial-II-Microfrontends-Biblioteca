package co.edu.uceva.loans.domain.model;

import java.time.LocalDate;

/**
 * Entidad de dominio: préstamo de un libro a un socio.
 * No depende de ningún framework.
 */
public class Loan {

    private Long id;
    private final Long bookId;
    private final Long memberId;
    private final LocalDate loanDate;
    private final LocalDate dueDate;
    private LocalDate returnDate;
    private LoanStatus status;

    public Loan(Long id, Long bookId, Long memberId, LocalDate loanDate, LocalDate dueDate,
                LocalDate returnDate, LoanStatus status) {
        this.id = id;
        this.bookId = bookId;
        this.memberId = memberId;
        this.loanDate = loanDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
    }

    /** Crea un préstamo nuevo en estado ACTIVE con fecha de hoy. */
    public static Loan create(Long bookId, Long memberId, LocalDate dueDate) {
        return new Loan(null, bookId, memberId, LocalDate.now(), dueDate, null, LoanStatus.ACTIVE);
    }

    /** Marca el préstamo como devuelto en la fecha indicada. */
    public void markAsReturned(LocalDate date) {
        this.returnDate = date;
        this.status = LoanStatus.RETURNED;
    }

    public boolean isReturned() {
        return status == LoanStatus.RETURNED;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBookId() { return bookId; }
    public Long getMemberId() { return memberId; }
    public LocalDate getLoanDate() { return loanDate; }
    public LocalDate getDueDate() { return dueDate; }
    public LocalDate getReturnDate() { return returnDate; }
    public LoanStatus getStatus() { return status; }
}
