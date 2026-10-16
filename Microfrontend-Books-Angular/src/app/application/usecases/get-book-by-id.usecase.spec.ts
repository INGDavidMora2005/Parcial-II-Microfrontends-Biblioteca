import { Book } from '../../domain/entities/book.entity';
import { BookRepository } from '../../domain/repositories/book.repository';
import { GetBookByIdUseCase } from './get-book-by-id.usecase';

describe('GetBookByIdUseCase', () => {
  const book: Book = { id: 2, title: 'DDD', author: 'Eric Evans', isbn: '978-0321125217', year: 2003, available: true };

  it('debe retornar el libro cuando el id es válido', async () => {
    const repository = { findById: jest.fn().mockResolvedValue(book) } as unknown as BookRepository;
    const result = await new GetBookByIdUseCase(repository).execute(2);
    expect(result).toEqual(book);
    expect(repository.findById).toHaveBeenCalledWith(2);
  });

  it.each([0, -1, 1.5, NaN])('debe rechazar el id inválido %p sin consultar el repositorio', async (id) => {
    const repository = { findById: jest.fn() } as unknown as BookRepository;
    await expect(new GetBookByIdUseCase(repository).execute(id)).rejects.toThrow(
      'El id debe ser un número entero positivo',
    );
    expect(repository.findById).not.toHaveBeenCalled();
  });
});
