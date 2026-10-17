import type { Member, NewMember } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';
import { CreateMemberUseCase } from './create-member.usecase';

describe('CreateMemberUseCase', () => {
  const valid: NewMember = { fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233' };
  const created: Member = { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true };

  const build = () => {
    const repository = { create: jest.fn().mockResolvedValue(created) } as unknown as MemberRepository;
    return { repository, useCase: new CreateMemberUseCase(repository) };
  };

  it('debe crear un socio con datos válidos', async () => {
    const { repository, useCase } = build();
    const result = await useCase.execute(valid);
    expect(result).toEqual(created);
    expect(repository.create).toHaveBeenCalledWith(valid);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('debe lanzar error cuando fullName está vacío', async () => {
    const { repository, useCase } = build();
    await expect(useCase.execute({ ...valid, fullName: '' })).rejects.toThrow('El nombre completo es obligatorio');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('debe lanzar error cuando fullName tiene solo espacios', async () => {
    const { repository, useCase } = build();
    await expect(useCase.execute({ ...valid, fullName: '   ' })).rejects.toThrow('El nombre completo es obligatorio');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('debe lanzar error cuando email está vacío', async () => {
    const { repository, useCase } = build();
    await expect(useCase.execute({ ...valid, email: '' })).rejects.toThrow('El correo electrónico es obligatorio');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('debe lanzar error cuando email no contiene @', async () => {
    const { repository, useCase } = build();
    await expect(useCase.execute({ ...valid, email: 'juanemail.com' })).rejects.toThrow(
      'El correo electrónico debe contener "@"',
    );
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('debe propagar el error del repositorio', async () => {
    const repository = { create: jest.fn().mockRejectedValue(new Error('Email duplicado')) } as unknown as MemberRepository;
    await expect(new CreateMemberUseCase(repository).execute(valid)).rejects.toThrow('Email duplicado');
  });
});