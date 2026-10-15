package uceva.members.infrastructure.controller;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import io.swagger.v3.oas.annotations.media.Schema;

public class CreateMemberRequest {

    @NotBlank(message = "El nombre completo es obligatorio")
    @Schema(description = "Nombre completo del socio", example = "Juan Perez")
    private String fullName;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El correo electrónico no es válido")
    @Schema(description = "Correo electrónico del socio", example = "juan@email.com")
    private String email;

    @Schema(description = "Teléfono del socio", example = "3001112233")
    private String phone;

    public CreateMemberRequest() {
    }

    public CreateMemberRequest(String fullName, String email, String phone) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
