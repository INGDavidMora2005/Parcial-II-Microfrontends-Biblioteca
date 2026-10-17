import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MEMBERS_API_URL } from '../config/api.config';
import { MemberApiGateway } from './member-api.gateway';

describe('MemberApiGateway', () => {
  let gateway: MemberApiGateway;
  let http: HttpTestingController;
  const dto = { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemberApiGateway, provideHttpClient(), provideHttpClientTesting()],
    });
    gateway = TestBed.inject(MemberApiGateway);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('findAll debe hacer GET /members y mapear la respuesta', async () => {
    const promise = gateway.findAll();
    const req = http.expectOne(MEMBERS_API_URL);
    expect(req.request.method).toBe('GET');
    req.flush([dto]);
    expect(await promise).toEqual([dto]);
  });

  it('findById debe hacer GET /members/:id', async () => {
    const promise = gateway.findById(1);
    const req = http.expectOne(`${MEMBERS_API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dto);
    expect(await promise).toEqual(dto);
  });

  it('create debe hacer POST /members con el cuerpo del socio', async () => {
    const promise = gateway.create({ fullName: 'Ana Garcia', email: 'ana@email.com', phone: '3003334455' });
    const req = http.expectOne(MEMBERS_API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ fullName: 'Ana Garcia', email: 'ana@email.com', phone: '3003334455' });
    req.flush(dto, { status: 201, statusText: 'Created' });
    expect(await promise).toEqual(dto);
  });

  it('debe usar el mensaje que envía el microservicio', async () => {
    const promise = gateway.findById(99);
    http.expectOne(`${MEMBERS_API_URL}/99`).flush({ message: 'Socio inexistente' }, { status: 404, statusText: 'Not Found' });
    await expect(promise).rejects.toThrow('Socio inexistente');
  });

  it('debe indicar que no hay conexión cuando el estado es 0', async () => {
    const promise = gateway.findAll();
    http.expectOne(MEMBERS_API_URL).error(new ProgressEvent('error'));
    await expect(promise).rejects.toThrow('No se pudo conectar con el servicio de socios');
  });

  it('debe informar el código cuando no hay mensaje en la respuesta', async () => {
    const promise = gateway.findAll();
    http.expectOne(MEMBERS_API_URL).flush(null, { status: 500, statusText: 'Server Error' });
    await expect(promise).rejects.toThrow('El servicio de socios respondió con el error 500');
  });

  it('debe devolver un mensaje genérico ante un error que no es HTTP', () => {
    const extract = (gateway as unknown as { extractMessage(e: unknown): string }).extractMessage;
    expect(extract.call(gateway, new Error('x'))).toBe('Ocurrió un error inesperado');
  });

  it('debe devolver "Socio no encontrado" cuando el 404 no incluye mensaje', async () => {
    const promise = gateway.findById(99);
    http.expectOne(`${MEMBERS_API_URL}/99`).flush(null, { status: 404, statusText: 'Not Found' });
    await expect(promise).rejects.toThrow('Socio no encontrado');
  });
});