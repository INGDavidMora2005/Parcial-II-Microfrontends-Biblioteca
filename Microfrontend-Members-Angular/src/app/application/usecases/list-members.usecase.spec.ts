import { TestBed } from '@angular/core/testing';
import { ListMembersUseCase } from './list-members.usecase';
import { MemberRepository } from '../../domain/repositories/member.repository';
import type { Member } from '../../domain/entities/member.entity';

describe('ListMembersUseCase', () => {
  let useCase: ListMembersUseCase;
  let repository: jest.Mocked<MemberRepository>;

  const mockMembers: Member[] = [
    { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true },
    { id: 2, fullName: 'Maria Gomez', email: 'maria@email.com', phone: '3002223344', active: true },
  ];

  beforeEach(() => {
    TestBed.resetTestingModule();
    repository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<MemberRepository>;
    TestBed.configureTestingModule({
      providers: [
        ListMembersUseCase,
        { provide: MemberRepository, useValue: repository },
      ],
    });
    useCase = TestBed.inject(ListMembersUseCase);
  });

  it('debe retornar la lista de miembros', async () => {
    repository.getAll.mockResolvedValue(mockMembers);

    const result = await useCase.execute();

    expect(result).toEqual(mockMembers);
    expect(repository.getAll).toHaveBeenCalledTimes(1);
  });

  it('debe propagar el error del repositorio', async () => {
    repository.getAll.mockRejectedValue(new Error('Error de base de datos'));

    await expect(useCase.execute()).rejects.toThrow('Error de base de datos');
  });
});
