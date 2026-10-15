package co.edu.uceva.loans.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Información general que muestra Swagger UI.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI loansOpenApi() {
        return new OpenAPI().info(new Info()
                .title("API de Préstamos - Biblioteca UCEVA")
                .description("Microservicio de préstamos (Clean Architecture). Consumido por mf-loans en el puerto 4203.")
                .version("1.0.0"));
    }
}
