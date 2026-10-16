import { Book, NewBook } from '../../domain/entities/book.entity';
import { BookDto, NewBookDto } from '../dtos/book.dto';

/**
 * Convierte entre los DTOs del microservicio y las entidades del dominio.
 */
export class BookMapper {
  static toEntity(dto: BookDto): Book {
    return {
      id: dto.id,
      title: dto.title,
      author: dto.author,
      isbn: dto.isbn,
      year: dto.year,
      available: dto.available,
    };
  }

  static toDto(book: NewBook): NewBookDto {
    return {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      year: book.year,
    };
  }
}
