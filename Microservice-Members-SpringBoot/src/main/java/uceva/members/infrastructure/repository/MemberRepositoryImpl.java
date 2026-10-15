package uceva.members.infrastructure.repository;

import java.util.List;
import java.util.Optional;

import uceva.members.domain.entity.Member;
import uceva.members.domain.repository.MemberRepository;
import uceva.members.infrastructure.datasource.MemberDatasource;

public class MemberRepositoryImpl implements MemberRepository {

    private final MemberDatasource datasource;

    public MemberRepositoryImpl(MemberDatasource datasource) {
        this.datasource = datasource;
    }

    @Override
    public List<Member> findAll() {
        return datasource.findAll();
    }

    @Override
    public Optional<Member> findById(Long id) {
        return datasource.findById(id);
    }

    @Override
    public Member save(Member member) {
        return datasource.save(member);
    }
}
