import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BOOKS_API_URL } from '../../../infrastructure/config/api.config';
import { BooksPage } from './books.page';

/**
 * Pruebas de la página con los providers reales (BOOKS_PROVIDERS):
 * recorren página -> casos de uso -> gateway -> HTTP simulado.
 */
describe('BooksPage', () => {
  let fixture: ComponentFixture<BooksPage>;
  let page: BooksPage;
  let http: HttpTestingController;
  const dto = (id: number) => ({ id, title: `Libro ${id}`, author: 'Autor', isbn: `${id}`, year: 2000 + id, available: true });
  const el = () => fixture.nativeElement as HTMLElement;
  const flushMicrotasks = () => new Promise<void>((resolve) => setTimeout(resolve));

  const init = async (list: unknown = [dto(1), dto(2)]) => {
    fixture.detectChanges();
    http.expectOne(BOOKS_API_URL).flush(list);
    await flushMicrotasks();
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BooksPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(BooksPage);
    page = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('debe mostrar el estado de carga y luego la tabla de libros', async () => {
    fixture.detectChanges();
    expect(page.state()).toBe('loading');
    expect(el().querySelector('[data-testid="loading"]')).not.toBeNull();
    http.expectOne(BOOKS_API_URL).flush([dto(1), dto(2)]);
    await flushMicrotasks();
    fixture.detectChanges();
    expect(page.state()).toBe('success');
    expect(el().querySelectorAll('[data-testid="book-row"]').length).toBe(2);
  });

  it('debe mostrar el error cuando falla la carga', async () => {
    fixture.detectChanges();
    http.expectOne(BOOKS_API_URL).flush({ message: 'Fallo del servicio' }, { status: 500, statusText: 'Error' });
    await flushMicrotasks();
    fixture.detectChanges();
    expect(page.state()).toBe('error');
    expect(el().querySelector('[data-testid="error"]')?.textContent).toContain('Fallo del servicio');
  });

  it('debe mostrar el detalle del libro seleccionado y poder cerrarlo', async () => {
    await init();
    const promise = page.selectBook(2);
    http.expectOne(`${BOOKS_API_URL}/2`).flush(dto(2));
    await promise;
    fixture.detectChanges();
    expect(el().querySelector('[data-testid="book-detail"]')?.textContent).toContain('Libro 2');
    page.closeDetail();
    fixture.detectChanges();
    expect(el().querySelector('[data-testid="book-detail"]')).toBeNull();
  });

  it('debe mostrar el error cuando falla la consulta del detalle', async () => {
    await init();
    const promise = page.selectBook(99);
    http.expectOne(`${BOOKS_API_URL}/99`).flush({ message: 'Libro con id 99 no encontrado' }, { status: 404, statusText: 'Not Found' });
    await promise;
    expect(page.errorMessage()).toBe('Libro con id 99 no encontrado');
  });

  it('debe abrir y cerrar el formulario', async () => {
    await init();
    page.openForm();
    fixture.detectChanges();
    expect(el().querySelector('[data-testid="book-form"]')).not.toBeNull();
    page.closeForm();
    fixture.detectChanges();
    expect(el().querySelector('[data-testid="book-form"]')).toBeNull();
  });

  it('debe crear un libro, cerrar el formulario y recargar la lista', async () => {
    await init();
    page.openForm();
    const promise = page.saveBook({ title: 'Nuevo', author: 'Autor', isbn: '9', year: 2024 });
    http.expectOne({ method: 'POST', url: BOOKS_API_URL }).flush({ ...dto(3), title: 'Nuevo' }, { status: 201, statusText: 'Created' });
    await flushMicrotasks();
    http.expectOne({ method: 'GET', url: BOOKS_API_URL }).flush([dto(1), dto(2), { ...dto(3), title: 'Nuevo' }]);
    await promise;
    fixture.detectChanges();
    expect(page.showForm()).toBe(false);
    expect(page.successMessage()).toContain('Nuevo');
    expect(el().querySelectorAll('[data-testid="book-row"]').length).toBe(3);
  });

  it('debe mostrar el error del formulario cuando la creación falla', async () => {
    await init();
    page.openForm();
    const promise = page.saveBook({ title: '', author: 'A', isbn: '1', year: 2000 });
    await promise;
    expect(page.formError()).toBe('El título es obligatorio');
    expect(page.showForm()).toBe(true);
  });

  it('debe usar un mensaje genérico cuando el error no es una instancia de Error', async () => {
    await init();
    const toMessage = (page as unknown as { toMessage(e: unknown): string }).toMessage;
    expect(toMessage.call(page, 'texto')).toBe('Ocurrió un error inesperado');
  });
});
