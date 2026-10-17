package uceva.members.application.usecase;

import uceva.members.domain.entity.Member;
import uceva.members.domain.exception.MemberNotFoundException;
import uceva.members.domain.repository.MemberRepository;

public class GetMemberByIdUseCase {

    private final MemberRepository memberRepository;

    public GetMemberByIdUseCase(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member execute(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Socio no encontrado con id: " + id));
    }
}
