import { Book, NewBook } from '../../domain/entities/book.entity';
import { BookRepository } from '../../domain/repositories/book.repository';
import { CreateBookUseCase } from './create-book.usecase';

describe('CreateBookUseCase', () => {
  const valid: NewBook = { title: '  Refactoring ', author: ' Martin Fowler ', isbn: ' 978-0134757599 ', year: 2018 };
  const created: Book = { id: 6, title: 'Refactoring', author: 'Martin Fowler', isbn: '978-0134757599', year: 2018, available: true };

  const build = () => {
    const repository = { create: jest.fn().mockResolvedValue(created) } as unknown as BookRepository;
    return { repository, useCase: new CreateBookUseCase(repository) };
  };

  it('debe normalizar los textos y crear el libro', async () => {
    const { repository, useCase } = build();
    const result = await useCase.execute(valid);
    expect(result).toEqual(created);
    expect(repository.create).toHaveBeenCalledWith({
      title: 'Refactoring', author: 'Martin Fowler', isbn: '978-0134757599', year: 2018,
    });
  });

  it.each([
    [{ ...valid, title: '   ' }, 'El título es obligatorio'],
    [{ ...valid, author: '' }, 'El autor es obligatorio'],
    [{ ...valid, isbn: '  ' }, 'El ISBN es obligatorio'],
    [{ ...valid, year: 0 }, 'El año debe ser un número entero mayor que cero'],
    [{ ...valid, year: 2018.5 }, 'El año debe ser un número entero mayor que cero'],
  ])('debe rechazar datos inválidos %#', async (data, message) => {
    const { repository, useCase } = build();
    await expect(useCase.execute(data as NewBook)).rejects.toThrow(message);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('debe tratar como vacíos los campos ausentes', async () => {
    const { useCase } = build();
    await expect(useCase.execute({ year: 2000 } as NewBook)).rejects.toThrow('El título es obligatorio');
  });
});
