package uceva.loans.infrastructure.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
import uceva.loans.infrastructure.controller.GlobalExceptionHandler.ErrorResponse;

import java.util.List;

@Tag(name = "Préstamos", description = "Consulta y registro de préstamos de libros")
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

    @Operation(summary = "Listar préstamos", description = "Retorna todos los préstamos registrados")
    @ApiResponse(responseCode = "200", description = "Lista de préstamos")
    @GetMapping
    public List<Loan> getAll() {
        return listLoansUseCase.execute();
    }

    @Operation(summary = "Obtener préstamo por id", description = "Retorna el préstamo con el id indicado")
    @ApiResponse(responseCode = "200", description = "Préstamo encontrado")
    @ApiResponse(responseCode = "404", description = "Préstamo no encontrado",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping("/{id}")
    public Loan getById(@Parameter(description = "Id del préstamo", example = "1") @PathVariable Integer id) {
        return getLoanByIdUseCase.execute(id);
    }

    @Operation(summary = "Registrar préstamo", description = "Crea un préstamo con fecha de hoy y estado ACTIVE")
    @ApiResponse(responseCode = "201", description = "Préstamo creado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PostMapping
    public ResponseEntity<Loan> create(@RequestBody CreateLoanRequest request) {
        Loan loan = createLoanUseCase.execute(request.bookTitle, request.memberName, request.dueDate);
        return ResponseEntity.status(HttpStatus.CREATED).body(loan);
    }

}
