import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { Book, NewBook } from '../../domain/entities/book.entity';
import { BookRepository } from '../../domain/repositories/book.repository';
import { BOOKS_API_URL } from '../config/api.config';
import { BookDto } from '../dtos/book.dto';
import { BookMapper } from '../mappers/book.mapper';

/**
 * API Gateway: implementa el puerto `BookRepository` consumiendo
 * el microservicio de libros por HTTP.
 */
@Injectable()
export class BookApiGateway implements BookRepository {
  private readonly http = inject(HttpClient);

  async findAll(): Promise<Book[]> {
    const dtos = await this.request(this.http.get<BookDto[]>(BOOKS_API_URL));
    return dtos.map((dto) => BookMapper.toEntity(dto));
  }

  async findById(id: number): Promise<Book> {
    const dto = await this.request(this.http.get<BookDto>(`${BOOKS_API_URL}/${id}`));
    return BookMapper.toEntity(dto);
  }

  async create(book: NewBook): Promise<Book> {
    const dto = await this.request(
      this.http.post<BookDto>(BOOKS_API_URL, BookMapper.toDto(book)),
    );
    return BookMapper.toEntity(dto);
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
      if (error.status === 0) return 'No se pudo conectar con el servicio de libros';
      return `El servicio de libros respondió con el error ${error.status}`;
    }
    return 'Ocurrió un error inesperado';
  }
}
