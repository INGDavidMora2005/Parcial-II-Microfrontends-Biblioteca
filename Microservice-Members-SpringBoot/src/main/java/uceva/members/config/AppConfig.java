package uceva.members.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import uceva.members.application.usecase.CreateMemberUseCase;
import uceva.members.application.usecase.GetMemberByIdUseCase;
import uceva.members.application.usecase.ListMembersUseCase;
import uceva.members.infrastructure.datasource.MemberDatasource;
import uceva.members.infrastructure.repository.MemberRepositoryImpl;

@Configuration
public class AppConfig {

    @Bean
    public MemberDatasource memberDatasource() {
        return new MemberDatasource();
    }

    @Bean
    public MemberRepositoryImpl memberRepository(MemberDatasource datasource) {
        return new MemberRepositoryImpl(datasource);
    }

    @Bean
    public ListMembersUseCase listMembersUseCase(MemberRepositoryImpl memberRepository) {
        return new ListMembersUseCase(memberRepository);
    }

    @Bean
    public GetMemberByIdUseCase getMemberByIdUseCase(MemberRepositoryImpl memberRepository) {
        return new GetMemberByIdUseCase(memberRepository);
    }

    @Bean
    public CreateMemberUseCase createMemberUseCase(MemberRepositoryImpl memberRepository) {
        return new CreateMemberUseCase(memberRepository);
    }
}
