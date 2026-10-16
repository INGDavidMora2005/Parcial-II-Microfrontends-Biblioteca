package uceva.loans.infrastructure.controller;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Datos para registrar un préstamo")
public class CreateLoanRequest {
    @Schema(description = "Título del libro prestado", example = "Cien años de soledad", requiredMode = Schema.RequiredMode.REQUIRED)
    public String bookTitle;

    @Schema(description = "Nombre del socio que recibe el libro", example = "Juan Pablo Devia", requiredMode = Schema.RequiredMode.REQUIRED)
    public String memberName;

    @Schema(description = "Fecha límite de devolución (YYYY-MM-DD)", example = "2026-11-15", requiredMode = Schema.RequiredMode.REQUIRED)
    public String dueDate;
}
