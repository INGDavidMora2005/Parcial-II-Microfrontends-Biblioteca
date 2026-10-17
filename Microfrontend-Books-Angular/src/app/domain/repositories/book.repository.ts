import { Book, NewBook } from '../entities/book.entity';

/**
 * Puerto del dominio para acceder a los libros.
 * @remarks
 * Es una clase abstracta para poder usarla como token de inyección.
 * La implementación concreta vive en la capa de infraestructura.
 */
export abstract class BookRepository {
  /** Obtiene todos los libros. */
  abstract findAll(): Promise<Book[]>;

  /** Obtiene un libro por su identificador. */
  abstract findById(id: number): Promise<Book>;

  /** Registra un libro nuevo y retorna el libro creado. */
  abstract create(book: NewBook): Promise<Book>;
}
