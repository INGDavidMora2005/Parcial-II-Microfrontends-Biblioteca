package uceva.loans.domain.exception;

public class LoanNotFoundException extends RuntimeException {

    public LoanNotFoundException(Integer id) {
        super("No existe un préstamo con id " + id);
    }
}
