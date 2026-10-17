import { Member } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';
import { ListMembersUseCase } from './list-members.usecase';

describe('ListMembersUseCase', () => {
  const members: Member[] = [
    { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true },
    { id: 2, fullName: 'Maria Gomez', email: 'maria@email.com', phone: '3002223344', active: true },
  ];

  it('debe retornar los socios del repositorio', async () => {
    const repository = { findAll: jest.fn().mockResolvedValue(members) } as unknown as MemberRepository;
    const result = await new ListMembersUseCase(repository).execute();
    expect(result).toEqual(members);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe propagar el error del repositorio', async () => {
    const repository = { findAll: jest.fn().mockRejectedValue(new Error('Error de base de datos')) } as unknown as MemberRepository;
    await expect(new ListMembersUseCase(repository).execute()).rejects.toThrow('Error de base de datos');
  });
});