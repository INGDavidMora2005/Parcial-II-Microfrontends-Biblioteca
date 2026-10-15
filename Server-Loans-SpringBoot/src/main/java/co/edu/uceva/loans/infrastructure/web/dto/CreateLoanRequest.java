package co.edu.uceva.loans.infrastructure.web.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

/**
 * Datos de entrada para registrar un préstamo.
 */
public record CreateLoanRequest(
        @Schema(description = "Id del libro", example = "3")
        @NotNull @Positive Long bookId,

        @Schema(description = "Id del socio", example = "1")
        @NotNull @Positive Long memberId,

        @Schema(description = "Fecha límite de devolución (yyyy-MM-dd)", example = "2026-12-31")
        @NotNull LocalDate dueDate
) {
}
