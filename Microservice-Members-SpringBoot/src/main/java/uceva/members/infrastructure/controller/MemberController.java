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

import uceva.members.application.usecase.CreateMemberUseCase;
import uceva.members.application.usecase.GetMemberByIdUseCase;
import uceva.members.application.usecase.ListMembersUseCase;
import uceva.members.domain.entity.Member;

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

    @GetMapping
    public ResponseEntity<List<Member>> list() {
        return ResponseEntity.ok(listMembersUseCase.execute());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getById(@PathVariable Long id) {
        Member member = getMemberByIdUseCase.execute(id);
        return ResponseEntity.ok(member);
    }

    @PostMapping
    public ResponseEntity<Member> create(@Valid @RequestBody CreateMemberRequest request) {
        Member member = createMemberUseCase.execute(request.getFullName(), request.getEmail(), request.getPhone());
        return ResponseEntity.status(HttpStatus.CREATED).body(member);
    }

    public record ErrorResponse(String message) {
    }
}
