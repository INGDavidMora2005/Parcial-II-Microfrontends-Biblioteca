import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookDetailComponent } from './book-detail.component';

describe('BookDetailComponent', () => {
  let fixture: ComponentFixture<BookDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BookDetailComponent] });
    fixture = TestBed.createComponent(BookDetailComponent);
  });

  it('debe mostrar los datos del libro disponible', () => {
    fixture.componentRef.setInput('book', { id: 3, title: 'Refactoring', author: 'Martin Fowler', isbn: '3', year: 2018, available: true });
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('#3');
    expect(text).toContain('Refactoring');
    expect(text).toContain('Martin Fowler');
    expect(text).toContain('Disponible');
  });

  it('debe mostrar "Prestado" cuando no está disponible', () => {
    fixture.componentRef.setInput('book', { id: 4, title: 'X', author: 'Y', isbn: '4', year: 2000, available: false });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Prestado');
  });

  it('debe emitir closed al pulsar el botón de cerrar', () => {
    fixture.componentRef.setInput('book', { id: 4, title: 'X', author: 'Y', isbn: '4', year: 2000, available: false });
    fixture.detectChanges();
    const spy = jest.fn();
    fixture.componentInstance.closed.subscribe(spy);
    fixture.nativeElement.querySelector('button').click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
