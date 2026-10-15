package co.edu.uceva.loans.domain.exception;

/**
 * Se lanza cuando no existe un préstamo con el id solicitado.
 */
public class LoanNotFoundException extends RuntimeException {

    public LoanNotFoundException(Long id) {
        super("No existe el préstamo con id " + id);
    }
}
