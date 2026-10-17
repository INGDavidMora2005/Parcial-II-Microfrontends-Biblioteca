import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Book } from '../../../domain/entities/book.entity';
import { BooksTableComponent } from './books-table.component';

describe('BooksTableComponent', () => {
  let fixture: ComponentFixture<BooksTableComponent>;
  const books: Book[] = [
    { id: 1, title: 'Clean Code', author: 'Robert C. Martin', isbn: '1', year: 2008, available: true },
    { id: 2, title: 'DDD', author: 'Eric Evans', isbn: '2', year: 2003, available: false },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BooksTableComponent] });
    fixture = TestBed.createComponent(BooksTableComponent);
  });

  it('debe mostrar un mensaje cuando no hay libros', () => {
    fixture.componentRef.setInput('books', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="empty"]')).not.toBeNull();
  });

  it('debe renderizar una fila por libro con su estado', () => {
    fixture.componentRef.setInput('books', books);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('[data-testid="book-row"]');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('Disponible');
    expect(rows[1].textContent).toContain('Prestado');
  });

  it('debe emitir el id al pulsar "Ver detalle"', () => {
    fixture.componentRef.setInput('books', books);
    fixture.detectChanges();
    const emitted: number[] = [];
    fixture.componentInstance.selected.subscribe((id) => emitted.push(id));
    fixture.nativeElement.querySelectorAll('button')[1].click();
    expect(emitted).toEqual([2]);
  });
});
