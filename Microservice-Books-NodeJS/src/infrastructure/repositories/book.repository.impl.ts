import { BookRepository } from '../../domain/repositories/book.repository';
import { BookMemoryDatasource } from '../datasources/book.memory.datasource';
import { Book, NewBook } from '../../domain/entities/book.entity';

/**
 * Implementación concreta del repositorio de libros usando la fuente de datos en memoria.
 * @remarks
 * Resuelve todas las operaciones del contrato del dominio.
 */
export class BookRepositoryImpl implements BookRepository {
  constructor(private readonly datasource: BookMemoryDatasource) {}

  async findAll(): Promise<Book[]> {
    return this.datasource.getAll();
  }

  async findById(id: number): Promise<Book | null> {
    return this.datasource.getById(id);
  }

  async create(book: NewBook): Promise<Book> {
    return this.datasource.save(book);
  }
}
