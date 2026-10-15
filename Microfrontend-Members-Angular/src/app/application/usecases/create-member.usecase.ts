import { inject, Injectable } from '@angular/core';
import { MemberRepository } from '../../domain/repositories/member.repository';
import type { Member } from '../../domain/entities/member.entity';
import type { NewMember } from '../../domain/entities/member.entity';

@Injectable()
export class CreateMemberUseCase {

  private readonly repository = inject(MemberRepository);

  async execute(member: NewMember): Promise<Member> {
    if (!member.fullName || !member.fullName.trim()) {
      throw new Error('El nombre completo es obligatorio');
    }
    if (!member.email || !member.email.trim()) {
      throw new Error('El correo electrónico es obligatorio');
    }
    if (!member.email.includes('@')) {
      throw new Error('El correo electrónico debe contener "@"');
    }
    return this.repository.create(member);
  }
}
