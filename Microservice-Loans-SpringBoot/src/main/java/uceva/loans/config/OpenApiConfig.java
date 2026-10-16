package uceva.loans.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI loansOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API de Préstamos")
                        .version("1.0")
                        .description("Microservicio de préstamos de la biblioteca - Parcial II UCEVA"));
    }
}
