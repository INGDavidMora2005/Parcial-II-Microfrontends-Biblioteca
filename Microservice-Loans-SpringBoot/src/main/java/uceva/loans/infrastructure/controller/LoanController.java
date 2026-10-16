package uceva.loans.infrastructure.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uceva.loans.application.usecase.CreateLoanUseCase;
import uceva.loans.application.usecase.GetLoanByIdUseCase;
import uceva.loans.application.usecase.ListLoansUseCase;
import uceva.loans.domain.entity.Loan;

import java.util.List;

@RestController
@RequestMapping("/loans")
public class LoanController {

    private final ListLoansUseCase listLoansUseCase;
    private final GetLoanByIdUseCase getLoanByIdUseCase;
    private final CreateLoanUseCase createLoanUseCase;

    public LoanController(ListLoansUseCase listLoansUseCase,
                          GetLoanByIdUseCase getLoanByIdUseCase,
                          CreateLoanUseCase createLoanUseCase) {
        this.listLoansUseCase = listLoansUseCase;
        this.getLoanByIdUseCase = getLoanByIdUseCase;
        this.createLoanUseCase = createLoanUseCase;
    }

    @GetMapping
    public List<Loan> getAll() {
        return listLoansUseCase.execute();
    }

    @GetMapping("/{id}")
    public Loan getById(@PathVariable Integer id) {
        return getLoanByIdUseCase.execute(id);
    }

    @PostMapping
    public ResponseEntity<Loan> create(@RequestBody CreateLoanRequest request) {
        Loan loan = createLoanUseCase.execute(request.bookTitle, request.memberName, request.dueDate);
        return ResponseEntity.status(HttpStatus.CREATED).body(loan);
    }

}
