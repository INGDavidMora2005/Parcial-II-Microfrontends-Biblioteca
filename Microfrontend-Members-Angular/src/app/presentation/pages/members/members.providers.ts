import { Provider } from '@angular/core';
import { CreateMemberUseCase } from '../../../application/usecases/create-member.usecase';
import { GetMemberByIdUseCase } from '../../../application/usecases/get-member-by-id.usecase';
import { ListMembersUseCase } from '../../../application/usecases/list-members.usecase';
import { MemberRepository } from '../../../domain/repositories/member.repository';
import { MemberApiGateway } from '../../../infrastructure/gateways/member-api.gateway';

/**
 * Raíz de composición del microfrontend.
 * @remarks
 * Enlaza el puerto (`MemberRepository`) con su implementación (`MemberApiGateway`)
 * y construye los casos de uso. Se declara en el componente de la página porque,
 * al cargarse desde el host, el `app.config.ts` del microfrontend no se ejecuta.
 */
export const MEMBERS_PROVIDERS: Provider[] = [
  { provide: MemberRepository, useClass: MemberApiGateway },
  {
    provide: ListMembersUseCase,
    useFactory: (repository: MemberRepository) => new ListMembersUseCase(repository),
    deps: [MemberRepository],
  },
  {
    provide: GetMemberByIdUseCase,
    useFactory: (repository: MemberRepository) => new GetMemberByIdUseCase(repository),
    deps: [MemberRepository],
  },
  {
    provide: CreateMemberUseCase,
    useFactory: (repository: MemberRepository) => new CreateMemberUseCase(repository),
    deps: [MemberRepository],
  },
];