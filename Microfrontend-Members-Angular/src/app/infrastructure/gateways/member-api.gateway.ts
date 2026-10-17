import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import type { Member, NewMember } from '../../domain/entities/member.entity';
import { MemberRepository } from '../../domain/repositories/member.repository';
import { MEMBERS_API_URL } from '../config/api.config';
import { MemberDto } from '../dtos/member.dto';
import { MemberMapper } from '../mappers/member.mapper';

/**
 * API Gateway: implementa el puerto `MemberRepository` consumiendo
 * el microservicio de socios por HTTP.
 */
@Injectable()
export class MemberApiGateway implements MemberRepository {
  private readonly http = inject(HttpClient);

  async findAll(): Promise<Member[]> {
    const dtos = await this.request(this.http.get<MemberDto[]>(MEMBERS_API_URL));
    return dtos.map((dto) => MemberMapper.toEntity(dto));
  }

  async findById(id: number): Promise<Member> {
    const dto = await this.request(this.http.get<MemberDto>(`${MEMBERS_API_URL}/${id}`));
    return MemberMapper.toEntity(dto);
  }

  async create(member: NewMember): Promise<Member> {
    const dto = await this.request(
      this.http.post<MemberDto>(MEMBERS_API_URL, MemberMapper.toCreateDto(member)),
    );
    return MemberMapper.toEntity(dto);
  }

  private async request<T>(request$: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(request$);
    } catch (error) {
      throw new Error(this.extractMessage(error));
    }
  }

  private extractMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as { message?: string } | null;
      if (body?.message) return body.message;
      if (error.status === 0) return 'No se pudo conectar con el servicio de socios';
      if (error.status === 404 && !body?.message) return 'Socio no encontrado';
      return `El servicio de socios respondió con el error ${error.status}`;
    }
    return 'Ocurrió un error inesperado';
  }
}