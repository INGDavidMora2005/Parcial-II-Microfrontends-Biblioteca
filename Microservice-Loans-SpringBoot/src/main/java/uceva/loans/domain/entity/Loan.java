package uceva.loans.domain.entity;

import java.time.LocalDate;

public class Loan {
    public Integer id;
    public String bookTitle;
    public String memberName;
    public LocalDate loanDate;
    public LocalDate dueDate;
    public LoanStatus status;

    public Loan(Integer id, String bookTitle, String memberName, LocalDate loanDate, LocalDate dueDate, LoanStatus status) {
        this.id = id;
        this.bookTitle = bookTitle;
        this.memberName = memberName;
        this.loanDate = loanDate;
        this.dueDate = dueDate;
        this.status = status;
    }
}
