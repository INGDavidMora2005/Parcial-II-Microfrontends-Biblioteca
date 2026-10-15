package uceva.members.infrastructure.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uceva.members.domain.entity.Member;

class MemberRepositoryImplTest {

    private MemberRepositoryImpl repository;

    @BeforeEach
    void setUp() {
        repository = new MemberRepositoryImpl(new uceva.members.infrastructure.datasource.MemberDatasource());
    }

    @Test
    void shouldReturnFiveSeedMembers() {
        assertEquals(5, repository.findAll().size());
    }

    @Test
    void shouldFindMemberById() {
        Member member = repository.findAll().get(0);
        assertTrue(repository.findById(member.getId()).isPresent());
        assertEquals(member.getFullName(), repository.findById(member.getId()).get().getFullName());
    }

    @Test
    void shouldReturnEmptyWhenNotFound() {
        assertFalse(repository.findById(999L).isPresent());
    }

    @Test
    void shouldSaveNewMember() {
        Member member = new Member(null, "Nuevo Socio", "nuevo@email.com", "3009999999", true);
        Member saved = repository.save(member);

        assertNotNull(saved.getId());
        assertTrue(saved.getId() > 0);
        assertTrue(saved.isActive());
        assertEquals(6, repository.findAll().size());
    }
}
