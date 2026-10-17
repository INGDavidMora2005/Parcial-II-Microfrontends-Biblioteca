package uceva.members.application.usecase;

import java.util.List;

import uceva.members.domain.entity.Member;
import uceva.members.domain.repository.MemberRepository;

public class ListMembersUseCase {

    private final MemberRepository memberRepository;

    public ListMembersUseCase(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> execute() {
        return memberRepository.findAll();
    }
}
