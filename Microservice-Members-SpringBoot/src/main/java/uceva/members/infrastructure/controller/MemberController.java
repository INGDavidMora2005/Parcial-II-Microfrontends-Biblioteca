package uceva.members.infrastructure.controller;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import uceva.members.application.usecase.CreateMemberUseCase;
import uceva.members.application.usecase.GetMemberByIdUseCase;
import uceva.members.application.usecase.ListMembersUseCase;
import uceva.members.domain.entity.Member;

@Tag(name = "Socios", description = "Operaciones de consulta y registro de socios")
@RestController
@RequestMapping("/members")
public class MemberController {

    private final ListMembersUseCase listMembersUseCase;
    private final GetMemberByIdUseCase getMemberByIdUseCase;
    private final CreateMemberUseCase createMemberUseCase;

    public MemberController(ListMembersUseCase listMembersUseCase,
                            GetMemberByIdUseCase getMemberByIdUseCase,
                            CreateMemberUseCase createMemberUseCase) {
        this.listMembersUseCase = listMembersUseCase;
        this.getMemberByIdUseCase = getMemberByIdUseCase;
        this.createMemberUseCase = createMemberUseCase;
    }

    @Operation(summary = "Listar socios", description = "Retorna la lista de todos los socios registrados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de socios",
                content = @Content(schema = @Schema(implementation = Member.class)))
    })
    @GetMapping
    public ResponseEntity<List<Member>> list() {
        return ResponseEntity.ok(listMembersUseCase.execute());
    }

    @Operation(summary = "Obtener socio por id", description = "Retorna el socio con el id especificado")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Socio encontrado",
                content = @Content(schema = @Schema(implementation = Member.class))),
        @ApiResponse(responseCode = "404", description = "Socio no encontrado",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Member> getById(
            @Parameter(description = "Id del socio", required = true, example = "1") @PathVariable Long id) {
        Member member = getMemberByIdUseCase.execute(id);
        return ResponseEntity.ok(member);
    }

    @Operation(summary = "Registrar socio", description = "Crea un nuevo socio")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Socio creado",
                content = @Content(schema = @Schema(implementation = Member.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos",
                content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<Member> create(@Valid @RequestBody CreateMemberRequest request) {
        Member member = createMemberUseCase.execute(request.getFullName(), request.getEmail(), request.getPhone());
        return ResponseEntity.status(HttpStatus.CREATED).body(member);
    }

    @Schema(name = "ErrorResponse", description = "Cuerpo de respuesta de error")
    public record ErrorResponse(@Schema(description = "Texto del error", example = "Socio no encontrado") String message) {
    }
}
