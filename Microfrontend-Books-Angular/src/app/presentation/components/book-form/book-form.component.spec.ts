import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookFormComponent } from './book-form.component';

describe('BookFormComponent', () => {
  let fixture: ComponentFixture<BookFormComponent>;
  let component: BookFormComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [BookFormComponent] });
    fixture = TestBed.createComponent(BookFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const fillValid = () =>
    component.form.setValue({ title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', year: 2008 });

  it('no debe emitir y debe marcar errores cuando el formulario es inválido', () => {
    const spy = jest.fn();
    component.submitted.subscribe(spy);
    component.onSubmit();
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
    expect(component.isInvalid('title')).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.invalid-feedback').length).toBe(4);
  });

  it('isInvalid debe ser falso mientras el campo no se haya tocado', () => {
    expect(component.isInvalid('year')).toBe(false);
  });

  it('debe emitir el libro cuando el formulario es válido', () => {
    const spy = jest.fn();
    component.submitted.subscribe(spy);
    fillValid();
    component.onSubmit();
    expect(spy).toHaveBeenCalledWith({ title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', year: 2008 });
  });

  it('debe enviar el formulario desde el botón Guardar', () => {
    const spy = jest.fn();
    component.submitted.subscribe(spy);
    fillValid();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button[type="submit"]').click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('debe emitir cancelled al cancelar', () => {
    const spy = jest.fn();
    component.cancelled.subscribe(spy);
    fixture.nativeElement.querySelector('button[type="button"]').click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar el mensaje de error recibido', () => {
    fixture.componentRef.setInput('errorMessage', 'El ISBN es obligatorio');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="form-error"]').textContent).toContain('El ISBN es obligatorio');
  });
});
