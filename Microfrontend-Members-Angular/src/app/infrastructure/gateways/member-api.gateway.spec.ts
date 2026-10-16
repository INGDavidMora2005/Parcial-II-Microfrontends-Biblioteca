import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { throwError } from 'rxjs';

import { MemberApiGateway } from './member-api.gateway';
import { MemberRepository } from '../../domain/repositories/member.repository';
import type { Member } from '../../domain/entities/member.entity';
import type { NewMember } from '../../domain/entities/member.entity';
import { MEMBERS_API_URL } from '../config/api.config';

describe('MemberApiGateway', () => {
  let gateway: MemberApiGateway;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        MemberApiGateway,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    gateway = TestBed.inject(MemberApiGateway);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getAll debe hacer GET a MEMBERS_API_URL y mapear los resultados', async () => {
    const dtos = [
      { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true },
      { id: 2, fullName: 'Maria Gomez', email: 'maria@email.com', phone: '3002223344', active: false },
    ];

    const promise = gateway.getAll();
    const req = httpMock.expectOne(MEMBERS_API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(dtos);

    const result: Member[] = await promise;
    expect(result).toEqual([
      { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true },
      { id: 2, fullName: 'Maria Gomez', email: 'maria@email.com', phone: '3002223344', active: false },
    ]);
  });

  it('getById debe hacer GET a MEMBERS_API_URL/{id}', async () => {
    const dto = { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true };

    const promise = gateway.getById(1);
    const req = httpMock.expectOne(`${MEMBERS_API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dto);

    const result: Member = await promise;
    expect(result).toEqual({ id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true });
  });

  it('create debe hacer POST con el cuerpo mapeado y retornar el resultado mapeado', async () => {
    const newMember: NewMember = { fullName: 'Ana Garcia', email: 'ana@email.com', phone: '3003334455' };
    const createdDto = { id: 3, fullName: 'Ana Garcia', email: 'ana@email.com', phone: '3003334455', active: true };

    const promise = gateway.create(newMember);
    const req = httpMock.expectOne(MEMBERS_API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ fullName: 'Ana Garcia', email: 'ana@email.com', phone: '3003334455' });
    req.flush(createdDto);

    const result: Member = await promise;
    expect(result).toEqual({ id: 3, fullName: 'Ana Garcia', email: 'ana@email.com', phone: '3003334455', active: true });
  });

  it('create con error 400 con message debe lanzar ese mensaje', async () => {
    const newMember: NewMember = { fullName: 'Ana Garcia', email: 'ana@email.com', phone: '3003334455' };

    const promise = gateway.create(newMember);
    const req = httpMock.expectOne(MEMBERS_API_URL);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Email duplicado' }, { status: 400, statusText: 'Bad Request' });

    await expect(promise).rejects.toThrow('Email duplicado');
  });

  it('error 500 sin message debe lanzar mensaje genérico', async () => {
    const promise = gateway.getAll();
    const req = httpMock.expectOne(MEMBERS_API_URL);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });

    await expect(promise).rejects.toThrow('Error al consultar el servicio de socios');
  });

  it('getById 404 con message debe lanzar ese mensaje', async () => {
    const promise = gateway.getById(999);
    const req = httpMock.expectOne(`${MEMBERS_API_URL}/999`);
    req.flush({ message: 'Socio inexistente' }, { status: 404, statusText: 'Not Found' });

    await expect(promise).rejects.toThrow('Socio inexistente');
  });

  it('getById 400 con message debe lanzar ese mensaje', async () => {
    const promise = gateway.getById(1);
    const req = httpMock.expectOne(`${MEMBERS_API_URL}/1`);
    req.flush({ message: 'Datos inválidos' }, { status: 400, statusText: 'Bad Request' });

    await expect(promise).rejects.toThrow('Datos inválidos');
  });

  it('getById 404 sin message debe lanzar "Socio no encontrado"', async () => {
    const promise = gateway.getById(999);
    const req = httpMock.expectOne(`${MEMBERS_API_URL}/999`);
    req.flush(null, { status: 404, statusText: 'Not Found' });

    await expect(promise).rejects.toThrow('Socio no encontrado');
  });

  it('status 0 (error de red) debe lanzar "No se pudo conectar con el servicio de socios"', async () => {
    const promise = gateway.getAll();
    const req = httpMock.expectOne(MEMBERS_API_URL);
    req.error(new ErrorEvent('Network error'));

    await expect(promise).rejects.toThrow('No se pudo conectar con el servicio de socios');
  });

  it('error que no es HttpErrorResponse debe lanzar mensaje genérico', async () => {
    const http = TestBed.inject(HttpClient);
    jest.spyOn(http, 'get').mockReturnValue(throwError(() => new Error('Error simple')));

    const promise = gateway.getAll();

    await expect(promise).rejects.toThrow('Error inesperado al consultar el servicio de socios');
  });

  it('error genérico debe lanzar mensaje genérico', async () => {
    const promise = gateway.getAll();
    const req = httpMock.expectOne(MEMBERS_API_URL);
    req.flush({ message: 'Error interno' }, { status: 500, statusText: 'Internal Server Error' });

    await expect(promise).rejects.toThrow('Error interno');
  });
});
