import { BookMapper } from './book.mapper';

describe('BookMapper', () => {
  it('debe convertir un DTO en entidad', () => {
    const dto = { id: 1, title: 'A', author: 'B', isbn: 'C', year: 2000, available: false };
    expect(BookMapper.toEntity(dto)).toEqual(dto);
  });

  it('debe convertir un libro nuevo en DTO de creación', () => {
    const book = { title: 'A', author: 'B', isbn: 'C', year: 2000 };
    expect(BookMapper.toDto(book)).toEqual(book);
  });
});
