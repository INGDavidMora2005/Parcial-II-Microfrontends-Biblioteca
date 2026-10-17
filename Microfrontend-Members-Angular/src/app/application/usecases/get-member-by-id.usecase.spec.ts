import { Member } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';
import { GetMemberByIdUseCase } from './get-member-by-id.usecase';

describe('GetMemberByIdUseCase', () => {
  const member: Member = { id: 2, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true };

  it('debe retornar el socio cuando el id es válido', async () => {
    const repository = { findById: jest.fn().mockResolvedValue(member) } as unknown as MemberRepository;
    const result = await new GetMemberByIdUseCase(repository).execute(2);
    expect(result).toEqual(member);
    expect(repository.findById).toHaveBeenCalledWith(2);
  });

  it.each([0, -1, 1.5, NaN])('debe rechazar el id inválido %p sin consultar el repositorio', async (id) => {
    const repository = { findById: jest.fn() } as unknown as MemberRepository;
    await expect(new GetMemberByIdUseCase(repository).execute(id)).rejects.toThrow(
      'El id debe ser un número entero positivo',
    );
    expect(repository.findById).not.toHaveBeenCalled();
  });
});