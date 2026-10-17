package uceva.members.application.usecase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uceva.members.domain.entity.Member;
import uceva.members.domain.exception.MemberNotFoundException;
import uceva.members.domain.repository.MemberRepository;

class GetMemberByIdUseCaseTest {

    private MemberRepository memberRepository;
    private GetMemberByIdUseCase useCase;

    @BeforeEach
    void setUp() {
        memberRepository = mock(MemberRepository.class);
        useCase = new GetMemberByIdUseCase(memberRepository);
    }

    @Test
    void shouldReturnMemberWhenExists() {
        Member member = new Member(1L, "Juan Perez", "juan@email.com", "3001112233", true);
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));

        Member result = useCase.execute(1L);

        assertEquals(member, result);
    }

    @Test
    void shouldThrowWhenNotFound() {
        when(memberRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(MemberNotFoundException.class, () -> useCase.execute(99L));
    }
}
