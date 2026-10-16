import { Book, NewBook } from '../entities/book.entity';

/**
 * Contrato del repositorio para la gestión de libros.
 * @remarks
 * Define las operaciones abstractas que la capa de infraestructura debe implementar.
 */
export interface BookRepository {
  /**
   * Obtiene todos los libros.
   * @returns Promesa con el listado completo de libros.
   */
  findAll(): Promise<Book[]>;

  /**
   * Busca un libro por su identificador único.
   * @param id - Identificador numérico del libro.
   * @returns Promesa con el libro si existe, o null si no se encuentra.
   */
  findById(id: number): Promise<Book | null>;

  /**
   * Almacena un nuevo libro en la fuente de datos.
   * @param book - Datos del libro sin id.
   * @returns Promesa con el libro creado con su id asignado.
   */
  create(book: NewBook): Promise<Book>;
}
