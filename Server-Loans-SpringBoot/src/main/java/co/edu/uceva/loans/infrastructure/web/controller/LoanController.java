package co.edu.uceva.loans.infrastructure.web.controller;

import co.edu.uceva.loans.application.usecase.CreateLoanUseCase;
import co.edu.uceva.loans.application.usecase.GetAllLoansUseCase;
import co.edu.uceva.loans.application.usecase.ReturnLoanUseCase;
import co.edu.uceva.loans.infrastructure.web.dto.CreateLoanRequest;
import co.edu.uceva.loans.infrastructure.web.dto.LoanResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Adaptador de entrada REST. Solo delega en los casos de uso.
 */
@RestController
@RequestMapping("/api/loans")
@Tag(name = "Préstamos", description = "Gestión de préstamos de libros")
public class LoanController {

    private final GetAllLoansUseCase getAllLoansUseCase;
    private final CreateLoanUseCase createLoanUseCase;
    private final ReturnLoanUseCase returnLoanUseCase;

    public LoanController(GetAllLoansUseCase getAllLoansUseCase,
                          CreateLoanUseCase createLoanUseCase,
                          ReturnLoanUseCase returnLoanUseCase) {
        this.getAllLoansUseCase = getAllLoansUseCase;
        this.createLoanUseCase = createLoanUseCase;
        this.returnLoanUseCase = returnLoanUseCase;
    }

    @GetMapping
    @Operation(summary = "Listar préstamos")
    public List<LoanResponse> getAll() {
        return getAllLoansUseCase.execute().stream()
                .map(LoanResponse::fromDomain)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar un préstamo")
    @ApiResponse(responseCode = "201", description = "Préstamo creado")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    public LoanResponse create(@Valid @RequestBody CreateLoanRequest request) {
        return LoanResponse.fromDomain(
                createLoanUseCase.execute(request.bookId(), request.memberId(), request.dueDate()));
    }

    @PatchMapping("/{id}/return")
    @Operation(summary = "Registrar la devolución de un préstamo")
    @ApiResponse(responseCode = "200", description = "Préstamo devuelto")
    @ApiResponse(responseCode = "400", description = "El préstamo ya estaba devuelto")
    @ApiResponse(responseCode = "404", description = "Préstamo no encontrado")
    public LoanResponse returnLoan(@PathVariable Long id) {
        return LoanResponse.fromDomain(returnLoanUseCase.execute(id));
    }
}
