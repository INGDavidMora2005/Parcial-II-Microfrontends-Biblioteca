import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import type { Member } from '../../domain/entities/member.entity';
import type { NewMember } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';
import type { CreateMemberDto, MemberDto } from '../dtos/member.dto';
import { MemberMapper } from '../mappers/member.mapper';
import { MEMBERS_API_URL } from '../config/api.config';

@Injectable()
export class MemberApiGateway extends MemberRepository {

  private readonly http = inject(HttpClient);

  async getAll(): Promise<Member[]> {
    try {
      const dtos = await firstValueFrom(this.http.get<MemberDto[]>(MEMBERS_API_URL));
      return dtos.map(dto => MemberMapper.toEntity(dto));
    } catch (error) {
      this.handleError(error);
    }
  }

  async getById(id: number): Promise<Member> {
    try {
      const dto = await firstValueFrom(this.http.get<MemberDto>(`${MEMBERS_API_URL}/${id}`));
      return MemberMapper.toEntity(dto);
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(member: NewMember): Promise<Member> {
    try {
      const dto = MemberMapper.toCreateDto(member);
      const created = await firstValueFrom(this.http.post<MemberDto>(MEMBERS_API_URL, dto));
      return MemberMapper.toEntity(created);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        throw new Error('No se pudo conectar con el servicio de socios');
      }
      if (error.status === 404 && !error.error?.message) {
        throw new Error('Socio no encontrado');
      }
      const message = error.error?.message || 'Error al consultar el servicio de socios';
      throw new Error(message);
    }
    throw new Error('Error inesperado al consultar el servicio de socios');
  }
}
