import { MemberMapper } from './member.mapper';
import type { Member } from '../../domain/entities/member.entity';
import type { NewMember } from '../../domain/entities/member.entity';
import type { CreateMemberDto, MemberDto } from './member.dto';

describe('MemberMapper', () => {
  it('toEntity debe mapear un MemberDto a Member campo a campo', () => {
    const dto: MemberDto = {
      id: 1,
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '3001112233',
      active: true,
    };

    const result: Member = MemberMapper.toEntity(dto);

    expect(result).toEqual({
      id: 1,
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '3001112233',
      active: true,
    });
  });

  it('toCreateDto debe mapear un NewMember a CreateMemberDto campo a campo', () => {
    const member: NewMember = {
      fullName: 'Maria Gomez',
      email: 'maria@email.com',
      phone: '3002223344',
    };

    const result: CreateMemberDto = MemberMapper.toCreateDto(member);

    expect(result).toEqual({
      fullName: 'Maria Gomez',
      email: 'maria@email.com',
      phone: '3002223344',
    });
  });

  it('toEntity debe convertir phone null en cadena vacía', () => {
    const dto: MemberDto = {
      id: 1,
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: null,
      active: true,
    };

    const result: Member = MemberMapper.toEntity(dto);

    expect(result.phone).toBe('');
  });

  it('toCreateDto debe convertir phone undefined en cadena vacía', () => {
    const member: NewMember = {
      fullName: 'Maria Gomez',
      email: 'maria@email.com',
      phone: undefined as unknown as string,
    };

    const result: CreateMemberDto = MemberMapper.toCreateDto(member);

    expect(result.phone).toBe('');
  });
});
