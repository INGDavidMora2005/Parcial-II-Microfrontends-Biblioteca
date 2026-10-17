import { BookRepository } from '../../domain/repositories/book.repository';
import { Book } from '../../domain/entities/book.entity';
import { CustomError } from '../../domain/errors/custom.error';

/**
 * Caso de uso para obtener un libro por su identificador.
 * @remarks
 * Lanza un error de tipo NotFound si el libro no existe.
 */
export class GetBookByIdUseCase {
  /**
   * @param bookRepository - Implementación del repositorio de libros.
   */
  constructor(private readonly bookRepository: BookRepository) {}

  /**
   * Ejecuta el caso de uso.
   * @param id - Identificador numérico del libro.
   * @returns Promesa que resuelve al libro encontrado.
   * @throws CustomError.notFound si el libro no existe.
   */
  async execute(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw CustomError.notFound(`Libro con id ${id} no encontrado`);
    }
    return book;
  }
}
