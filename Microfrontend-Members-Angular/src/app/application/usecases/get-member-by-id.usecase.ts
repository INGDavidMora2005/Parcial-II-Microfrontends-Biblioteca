import { inject, Injectable } from '@angular/core';
import { MemberRepository } from '../../domain/repositories/member.repository';
import type { Member } from '../../domain/entities/member.entity';

@Injectable()
export class GetMemberByIdUseCase {

  private readonly repository = inject(MemberRepository);

  async execute(id: number): Promise<Member> {
    return this.repository.getById(id);
  }
}
