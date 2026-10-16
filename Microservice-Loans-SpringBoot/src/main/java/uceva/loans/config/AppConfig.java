package uceva.loans.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import uceva.loans.application.usecase.CreateLoanUseCase;
import uceva.loans.application.usecase.GetLoanByIdUseCase;
import uceva.loans.application.usecase.ListLoansUseCase;
import uceva.loans.domain.repository.LoanRepository;
import uceva.loans.infrastructure.datasource.LoanDatasource;
import uceva.loans.infrastructure.repository.LoanRepositoryImpl;

@Configuration
public class AppConfig {

    @Bean
    LoanDatasource loanDatasource() {
        return new LoanDatasource();
    }

    @Bean
    LoanRepository loanRepository(LoanDatasource loanDatasource) {
        return new LoanRepositoryImpl(loanDatasource);
    }

    @Bean
    ListLoansUseCase listLoansUseCase(LoanRepository loanRepository) {
        return new ListLoansUseCase(loanRepository);
    }

    @Bean
    GetLoanByIdUseCase getLoanByIdUseCase(LoanRepository loanRepository) {
        return new GetLoanByIdUseCase(loanRepository);
    }

    @Bean
    CreateLoanUseCase createLoanUseCase(LoanRepository loanRepository) {
        return new CreateLoanUseCase(loanRepository);
    }

}
