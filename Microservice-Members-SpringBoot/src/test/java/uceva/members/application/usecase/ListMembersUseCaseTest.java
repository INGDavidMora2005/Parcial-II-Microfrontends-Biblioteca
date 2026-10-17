package uceva.members.application.usecase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uceva.members.domain.entity.Member;
import uceva.members.domain.repository.MemberRepository;

class ListMembersUseCaseTest {

    private MemberRepository memberRepository;
    private ListMembersUseCase useCase;

    @BeforeEach
    void setUp() {
        memberRepository = mock(MemberRepository.class);
        useCase = new ListMembersUseCase(memberRepository);
    }

    @Test
    void shouldListAllMembers() {
        Member member = new Member(1L, "Juan Perez", "juan@email.com", "3001112233", true);
        when(memberRepository.findAll()).thenReturn(List.of(member));

        List<Member> result = useCase.execute();

        assertEquals(1, result.size());
        assertEquals(member, result.get(0));
    }
}
