import { TestBed } from '@angular/core/testing';
import { GetMemberByIdUseCase } from './get-member-by-id.usecase';
import { MemberRepository } from '../../domain/repositories/member.repository';
import type { Member } from '../../domain/entities/member.entity';

describe('GetMemberByIdUseCase', () => {
  let useCase: GetMemberByIdUseCase;
  let repository: jest.Mocked<MemberRepository>;

  const mockMember: Member = {
    id: 1,
    fullName: 'Juan Perez',
    email: 'juan@email.com',
    phone: '3001112233',
    active: true,
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    repository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<MemberRepository>;
    TestBed.configureTestingModule({
      providers: [
        GetMemberByIdUseCase,
        { provide: MemberRepository, useValue: repository },
      ],
    });
    useCase = TestBed.inject(GetMemberByIdUseCase);
  });

  it('debe retornar el miembro por id', async () => {
    repository.getById.mockResolvedValue(mockMember);

    const result = await useCase.execute(1);

    expect(result).toEqual(mockMember);
    expect(repository.getById).toHaveBeenCalledWith(1);
    expect(repository.getById).toHaveBeenCalledTimes(1);
  });

  it('debe propagar el error del repositorio cuando no existe', async () => {
    repository.getById.mockRejectedValue(new Error('Socio no encontrado'));

    await expect(useCase.execute(999)).rejects.toThrow('Socio no encontrado');
  });
});
