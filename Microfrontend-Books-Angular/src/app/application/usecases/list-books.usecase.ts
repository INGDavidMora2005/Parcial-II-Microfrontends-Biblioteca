import { Book } from '../../domain/entities/book.entity';
import { BookRepository } from '../../domain/repositories/book.repository';

/**
 * Caso de uso: listar el catálogo de libros.
 */
export class ListBooksUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  execute(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }
}
