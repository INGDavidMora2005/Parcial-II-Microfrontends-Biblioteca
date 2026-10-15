package uceva.members.infrastructure.datasource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import uceva.members.domain.entity.Member;

class MemberDatasourceTest {

    private MemberDatasource datasource;

    @BeforeEach
    void setUp() {
        datasource = new MemberDatasource();
    }

    @Test
    void shouldReturnFiveSeedMembers() {
        assertEquals(5, datasource.findAll().size());
    }

    @Test
    void shouldFindMemberById() {
        Member member = datasource.findAll().get(0);
        assertTrue(datasource.findById(member.getId()).isPresent());
        assertEquals(member.getFullName(), datasource.findById(member.getId()).get().getFullName());
    }

    @Test
    void shouldReturnEmptyWhenNotFound() {
        assertFalse(datasource.findById(999L).isPresent());
    }

    @Test
    void shouldSaveNewMemberWithAutoIncrementalId() {
        Member member = new Member(null, "Nuevo Socio", "nuevo@email.com", "3009999999", true);
        Member saved = datasource.save(member);

        assertNotNull(saved.getId());
        assertTrue(saved.getId() > 0);
        assertTrue(saved.isActive());
        assertEquals(6, datasource.findAll().size());
    }
}
