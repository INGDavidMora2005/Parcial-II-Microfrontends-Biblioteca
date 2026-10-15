import { BookRepository } from '../../domain/repositories/book.repository.js';
import { NewBook } from '../../domain/entities/book.entity.js';
import { CustomError } from '../../domain/errors/custom.error.js';

/**
 * Caso de uso para crear un nuevo libro.
 * @remarks
 * Valida que los campos obligatorios estén presentes y no vacíos.
 * Asigna automáticamente available: true.
 */
export class CreateBookUseCase {
  /**
   * @param bookRepository - Implementación del repositorio de libros.
   */
  constructor(private readonly bookRepository: BookRepository) {}

  /**
   * Ejecuta el caso de uso.
   * @param data - Objeto con title, author, isbn, year (sin id).
   * @returns Promesa que resuelve al libro creado.
   * @throws CustomError.badRequest si falta algún campo obligatorio o es inválido.
   */
  async execute(data: NewBook): Promise<Book> {
    // Validaciones de tipo y contenido
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      throw CustomError.badRequest('El título es obligatorio y debe ser una cadena no vacía');
    }
    if (!data.author || typeof data.author !== 'string' || !data.author.trim()) {
      throw CustomError.badRequest('El autor es obligatorio y debe ser una cadena no vacía');
    }
    if (!data.isbn || typeof data.isbn !== 'string' || !data.isbn.trim()) {
      throw CustomError.badRequest('El ISBN es obligatorio y debe ser una cadena no vacía');
    }
    if (typeof data.year !== 'number' || !Number.isInteger(data.year) || data.year <= 0) {
      throw CustomError.badRequest('El año debe ser un número entero mayor que cero');
    }

    // Aplicar trim a los campos de texto
    const bookData: NewBook = {
      title: data.title.trim(),
      author: data.author.trim(),
      isbn: data.isbn.trim(),
      year: data.year,
    };

    // available siempre inicia en true
    return this.bookRepository.create(bookData);
  }
}
