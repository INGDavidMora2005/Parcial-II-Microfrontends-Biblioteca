package uceva.members.domain.repository;

import java.util.List;
import java.util.Optional;

import uceva.members.domain.entity.Member;

public interface MemberRepository {

    List<Member> findAll();

    Optional<Member> findById(Long id);

    Member save(Member member);
}
