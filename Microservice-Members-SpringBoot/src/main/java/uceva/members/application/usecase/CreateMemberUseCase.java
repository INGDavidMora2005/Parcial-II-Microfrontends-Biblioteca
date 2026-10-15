package uceva.members.application.usecase;

import uceva.members.domain.entity.Member;
import uceva.members.domain.exception.InvalidMemberException;
import uceva.members.domain.repository.MemberRepository;

public class CreateMemberUseCase {

    private final MemberRepository memberRepository;

    public CreateMemberUseCase(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member execute(String fullName, String email, String phone) {
        if (fullName == null || fullName.isBlank()) {
            throw new InvalidMemberException("El nombre completo es obligatorio");
        }
        if (email == null || email.isBlank()) {
            throw new InvalidMemberException("El correo electrónico es obligatorio");
        }

        Member member = new Member();
        member.setFullName(fullName);
        member.setEmail(email);
        member.setPhone(phone);
        member.setActive(true);
        return memberRepository.save(member);
    }
}
