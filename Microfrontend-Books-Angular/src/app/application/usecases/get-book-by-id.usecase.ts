import { Book } from '../../domain/entities/book.entity';
import { BookRepository } from '../../domain/repositories/book.repository';

/**
 * Caso de uso: obtener el detalle de un libro por su id.
 * @remarks
 * Valida el id antes de consultar el repositorio.
 */
export class GetBookByIdUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(id: number): Promise<Book> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('El id debe ser un número entero positivo');
    }
    return this.bookRepository.findById(id);
  }
}
