import { Book } from '../../domain/entities/book.entity';
import { BookRepository } from '../../domain/repositories/book.repository';
import { ListBooksUseCase } from './list-books.usecase';

describe('ListBooksUseCase', () => {
  const books: Book[] = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', year: 2008, available: true },
  ];

  it('debe retornar los libros del repositorio', async () => {
    const repository = { findAll: jest.fn().mockResolvedValue(books) } as unknown as BookRepository;
    const result = await new ListBooksUseCase(repository).execute();
    expect(result).toEqual(books);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  it('debe propagar el error del repositorio', async () => {
    const repository = { findAll: jest.fn().mockRejectedValue(new Error('fallo')) } as unknown as BookRepository;
    await expect(new ListBooksUseCase(repository).execute()).rejects.toThrow('fallo');
  });
});
