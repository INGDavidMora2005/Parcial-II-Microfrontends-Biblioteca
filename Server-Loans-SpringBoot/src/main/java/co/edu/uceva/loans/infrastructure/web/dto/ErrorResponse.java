package co.edu.uceva.loans.infrastructure.web.dto;

/**
 * Formato de respuesta para errores.
 */
public record ErrorResponse(int status, String message) {
}
