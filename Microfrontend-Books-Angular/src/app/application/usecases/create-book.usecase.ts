import { Book, NewBook } from '../../domain/entities/book.entity';
import { BookRepository } from '../../domain/repositories/book.repository';

/**
 * Caso de uso: registrar un libro nuevo.
 * @remarks
 * Valida y normaliza los datos antes de enviarlos al repositorio.
 */
export class CreateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(data: NewBook): Promise<Book> {
    const title = data.title?.trim();
    const author = data.author?.trim();
    const isbn = data.isbn?.trim();

    if (!title) throw new Error('El título es obligatorio');
    if (!author) throw new Error('El autor es obligatorio');
    if (!isbn) throw new Error('El ISBN es obligatorio');
    if (!Number.isInteger(data.year) || data.year <= 0) {
      throw new Error('El año debe ser un número entero mayor que cero');
    }

    return this.bookRepository.create({ title, author, isbn, year: data.year });
  }
}
