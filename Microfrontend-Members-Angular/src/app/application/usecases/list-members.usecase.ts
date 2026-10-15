import { inject, Injectable } from '@angular/core';
import { MemberRepository } from '../../domain/repositories/member.repository';
import type { Member } from '../../domain/entities/member.entity';

@Injectable()
export class ListMembersUseCase {

  private readonly repository = inject(MemberRepository);

  async execute(): Promise<Member[]> {
    return this.repository.getAll();
  }
}
