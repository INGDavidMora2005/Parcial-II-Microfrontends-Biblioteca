import { Book, NewBook } from '../../domain/entities/book.entity';

/**
 * Datasource en memoria para la entidad Book.
 * @remarks
 * Contiene 5 registros semilla con datos reales y un contador autoincremental.
 */
export class BookMemoryDatasource {
  private books: Book[] = [
    {
      id: 1,
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      isbn: '978-0132350884',
      year: 2008,
      available: true,
    },
    {
      id: 2,
      title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      isbn: '978-0201633610',
      year: 1994,
      available: true,
    },
    {
      id: 3,
      title: 'Clean Architecture: A Craftsman\'s Guide to Software Structure and Design',
      author: 'Robert C. Martin',
      isbn: '978-0134494166',
      year: 2017,
      available: true,
    },
    {
      id: 4,
      title: 'Refactoring: Improving the Design of Existing Code',
      author: 'Martin Fowler',
      isbn: '978-0134757599',
      year: 2018,
      available: true,
    },
    {
      id: 5,
      title: 'Domain-Driven Design: Tackling Complexity in the Heart of Software',
      author: 'Eric Evans',
      isbn: '978-0321125217',
      year: 2003,
      available: true,
    },
  ];

  private currentId: number = 6;

  /**
   * Obtiene todos los libros almacenados.
   * @returns Promesa con la copia del arreglo de libros.
   */
  async getAll(): Promise<Book[]> {
    return [...this.books];
  }

  /**
   * Busca un libro por su id.
   * @param id - Identificador numérico.
   * @returns Promesa con el libro encontrado o null.
   */
  async getById(id: number): Promise<Book | null> {
    const book = this.books.find((b) => b.id === id);
    return book ? { ...book } : null;
  }

  /**
   * Guarda un nuevo libro asignándole un id autoincremental y available en true.
   * @param book - Datos del libro sin id.
   * @returns Promesa con el libro creado.
   */
  async save(book: NewBook): Promise<Book> {
    const newBook: Book = {
      id: this.currentId++,
      ...book,
      available: true,
    };
    this.books.push(newBook);
    return { ...newBook };
  }
}
