import { BookRepository } from '../../domain/repositories/book.repository';
import { Book } from '../../domain/entities/book.entity';

/**
 * Caso de uso para listar todos los libros.
 * @remarks
 * Depende de la abstracción del repositorio, no de su implementación.
 */
export class ListBooksUseCase {
  /**
   * @param bookRepository - Implementación del repositorio de libros.
   */
  constructor(private readonly bookRepository: BookRepository) {}

  /**
   * Ejecuta el caso de uso.
   * @returns Promesa que resuelve a un arreglo de todos los libros.
   */
  async execute(): Promise<Book[]> {
    return this.bookRepository.findAll();
  }
}
