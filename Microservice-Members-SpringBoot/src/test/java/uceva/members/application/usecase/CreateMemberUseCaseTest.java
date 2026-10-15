package uceva.members.application.usecase;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uceva.members.domain.entity.Member;
import uceva.members.domain.exception.InvalidMemberException;
import uceva.members.domain.repository.MemberRepository;

class CreateMemberUseCaseTest {

    private MemberRepository memberRepository;
    private CreateMemberUseCase useCase;

    @BeforeEach
    void setUp() {
        memberRepository = mock(MemberRepository.class);
        useCase = new CreateMemberUseCase(memberRepository);
    }

    @Test
    void shouldCreateMemberWithActiveTrue() {
        Member saved = new Member(1L, "Juan Perez", "juan@email.com", "3001112233", true);
        when(memberRepository.save(any(Member.class))).thenReturn(saved);

        Member result = useCase.execute("Juan Perez", "juan@email.com", "3001112233");

        assertEquals(true, result.isActive());
        assertEquals("Juan Perez", result.getFullName());
        assertEquals("juan@email.com", result.getEmail());
        assertEquals("3001112233", result.getPhone());
        verify(memberRepository).save(any(Member.class));
    }

    @Test
    void shouldThrowWhenFullNameIsBlank() {
        assertThrows(InvalidMemberException.class, () -> useCase.execute("", "juan@email.com", "3001112233"));
    }

    @Test
    void shouldThrowWhenFullNameIsNull() {
        assertThrows(InvalidMemberException.class, () -> useCase.execute(null, "juan@email.com", "3001112233"));
    }

    @Test
    void shouldThrowWhenEmailIsBlank() {
        assertThrows(InvalidMemberException.class, () -> useCase.execute("Juan Perez", "", "3001112233"));
    }

    @Test
    void shouldThrowWhenEmailIsNull() {
        assertThrows(InvalidMemberException.class, () -> useCase.execute("Juan Perez", null, "3001112233"));
    }
}
