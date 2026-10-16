import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BOOKS_API_URL } from '../config/api.config';
import { BookApiGateway } from './book-api.gateway';

describe('BookApiGateway', () => {
  let gateway: BookApiGateway;
  let http: HttpTestingController;
  const dto = { id: 1, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', year: 2008, available: true };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookApiGateway, provideHttpClient(), provideHttpClientTesting()],
    });
    gateway = TestBed.inject(BookApiGateway);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('findAll debe hacer GET /books y mapear la respuesta', async () => {
    const promise = gateway.findAll();
    const req = http.expectOne(BOOKS_API_URL);
    expect(req.request.method).toBe('GET');
    req.flush([dto]);
    expect(await promise).toEqual([dto]);
  });

  it('findById debe hacer GET /books/:id', async () => {
    const promise = gateway.findById(1);
    const req = http.expectOne(`${BOOKS_API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dto);
    expect(await promise).toEqual(dto);
  });

  it('create debe hacer POST /books con el cuerpo del libro', async () => {
    const promise = gateway.create({ title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', year: 2008 });
    const req = http.expectOne(BOOKS_API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', year: 2008 });
    req.flush(dto, { status: 201, statusText: 'Created' });
    expect(await promise).toEqual(dto);
  });

  it('debe usar el mensaje que envía el microservicio', async () => {
    const promise = gateway.findById(99);
    http.expectOne(`${BOOKS_API_URL}/99`).flush({ message: 'Libro con id 99 no encontrado' }, { status: 404, statusText: 'Not Found' });
    await expect(promise).rejects.toThrow('Libro con id 99 no encontrado');
  });

  it('debe indicar que no hay conexión cuando el estado es 0', async () => {
    const promise = gateway.findAll();
    http.expectOne(BOOKS_API_URL).error(new ProgressEvent('error'));
    await expect(promise).rejects.toThrow('No se pudo conectar con el servicio de libros');
  });

  it('debe informar el código cuando no hay mensaje en la respuesta', async () => {
    const promise = gateway.findAll();
    http.expectOne(BOOKS_API_URL).flush(null, { status: 500, statusText: 'Server Error' });
    await expect(promise).rejects.toThrow('El servicio de libros respondió con el error 500');
  });

  it('debe devolver un mensaje genérico ante un error que no es HTTP', () => {
    const extract = (gateway as unknown as { extractMessage(e: unknown): string }).extractMessage;
    expect(extract.call(gateway, new Error('x'))).toBe('Ocurrió un error inesperado');
  });
});
