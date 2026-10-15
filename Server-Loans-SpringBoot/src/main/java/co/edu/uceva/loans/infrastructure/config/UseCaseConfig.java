package co.edu.uceva.loans.infrastructure.config;

import co.edu.uceva.loans.application.usecase.CreateLoanUseCase;
import co.edu.uceva.loans.application.usecase.GetAllLoansUseCase;
import co.edu.uceva.loans.application.usecase.ReturnLoanUseCase;
import co.edu.uceva.loans.domain.repository.LoanRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registra los casos de uso como beans de Spring.
 * Así la capa de aplicación queda libre de anotaciones del framework.
 */
@Configuration
public class UseCaseConfig {

    @Bean
    public GetAllLoansUseCase getAllLoansUseCase(LoanRepository loanRepository) {
        return new GetAllLoansUseCase(loanRepository);
    }

    @Bean
    public CreateLoanUseCase createLoanUseCase(LoanRepository loanRepository) {
        return new CreateLoanUseCase(loanRepository);
    }

    @Bean
    public ReturnLoanUseCase returnLoanUseCase(LoanRepository loanRepository) {
        return new ReturnLoanUseCase(loanRepository);
    }
}
