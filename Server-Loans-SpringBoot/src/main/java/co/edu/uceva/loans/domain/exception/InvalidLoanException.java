package co.edu.uceva.loans.domain.exception;

/**
 * Se lanza cuando una operación viola una regla de negocio del préstamo.
 */
public class InvalidLoanException extends RuntimeException {

    public InvalidLoanException(String message) {
        super(message);
    }
}
