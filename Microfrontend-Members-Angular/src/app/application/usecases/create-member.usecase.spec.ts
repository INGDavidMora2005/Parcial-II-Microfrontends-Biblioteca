import { TestBed } from '@angular/core/testing';
import { CreateMemberUseCase } from './create-member.usecase';
import { MemberRepository } from '../../domain/repositories/member.repository';
import type { Member } from '../../domain/entities/member.entity';
import type { NewMember } from '../../domain/entities/member.entity';

describe('CreateMemberUseCase', () => {
  let useCase: CreateMemberUseCase;
  let repository: jest.Mocked<MemberRepository>;

  const mockMember: Member = {
    id: 1,
    fullName: 'Juan Perez',
    email: 'juan@email.com',
    phone: '3001112233',
    active: true,
  };

  const validNewMember: NewMember = {
    fullName: 'Juan Perez',
    email: 'juan@email.com',
    phone: '3001112233',
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
        CreateMemberUseCase,
        { provide: MemberRepository, useValue: repository },
      ],
    });
    useCase = TestBed.inject(CreateMemberUseCase);
  });

  it('debe crear un miembro con datos válidos', async () => {
    repository.create.mockResolvedValue(mockMember);

    const result = await useCase.execute(validNewMember);

    expect(result).toEqual(mockMember);
    expect(repository.create).toHaveBeenCalledWith(validNewMember);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });

  it('debe lanzar error cuando fullName está vacío', async () => {
    await expect(
      useCase.execute({ ...validNewMember, fullName: '' })
    ).rejects.toThrow('El nombre completo es obligatorio');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('debe lanzar error cuando fullName tiene solo espacios', async () => {
    await expect(
      useCase.execute({ ...validNewMember, fullName: '   ' })
    ).rejects.toThrow('El nombre completo es obligatorio');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('debe lanzar error cuando email está vacío', async () => {
    await expect(
      useCase.execute({ ...validNewMember, email: '' })
    ).rejects.toThrow('El correo electrónico es obligatorio');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('debe lanzar error cuando email no contiene @', async () => {
    await expect(
      useCase.execute({ ...validNewMember, email: 'juanemail.com' })
    ).rejects.toThrow('El correo electrónico debe contener "@"');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('debe propagar el error del repositorio', async () => {
    repository.create.mockRejectedValue(new Error('Error al guardar'));

    await expect(useCase.execute(validNewMember)).rejects.toThrow('Error al guardar');
  });
});
