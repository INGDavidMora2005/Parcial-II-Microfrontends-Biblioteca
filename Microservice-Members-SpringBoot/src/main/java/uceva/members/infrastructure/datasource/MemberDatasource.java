package uceva.members.infrastructure.datasource;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import uceva.members.domain.entity.Member;

public class MemberDatasource {

    private final List<Member> members = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(0);

    public MemberDatasource() {
        seedMembers();
    }

    private void seedMembers() {
        add(new Member(null, "David Mora Duque", "david.mora@uceva.edu.co", "3001234567", true));
        add(new Member(null, "Juan Diego Rodriguez", "juand.rodriguez@uceva.edu.co", "3002345678", true));
        add(new Member(null, "Juan Pablo Devia", "juanp.devia@uceva.edu.co", "3003456789", true));
        add(new Member(null, "Maria Fernanda Lopez", "maria.lopez@uceva.edu.co", "3004567890", true));
        add(new Member(null, "Carlos Alberto Ruiz", "carlos.ruiz@uceva.edu.co", "3005678901", true));
    }

    private void add(Member member) {
        member.setId(idCounter.incrementAndGet());
        members.add(member);
    }

    public List<Member> findAll() {
        return new ArrayList<>(members);
    }

    public Optional<Member> findById(Long id) {
        return members.stream()
                .filter(m -> id.equals(m.getId()))
                .findFirst();
    }

    public Member save(Member member) {
        if (member.getId() == null) {
            member.setId(idCounter.incrementAndGet());
            members.add(member);
        } else {
            for (int i = 0; i < members.size(); i++) {
                if (members.get(i).getId().equals(member.getId())) {
                    members.set(i, member);
                    break;
                }
            }
        }
        return member;
    }
}
