import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LOANS_MOCK, NEW_LOAN_MOCK } from '../../mocks/loans.mocks';
import { LoanApiGateway } from './loan-api.gateway';

describe('LoanApiGateway', () => {
  let gateway: LoanApiGateway;
  let httpMock: HttpTestingController;
  const url = 'http://localhost:3003/api/loans';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoanApiGateway, provideHttpClient(), provideHttpClientTesting()],
    });
    gateway = TestBed.inject(LoanApiGateway);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no queden peticiones HTTP pendientes
    httpMock.verify();
  });

  describe('Creación del gateway', () => {
    it('debería crearse correctamente', () => {
      expect(gateway).toBeTruthy();
    });
  });

  describe('list', () => {
    it('debería realizar una petición GET y retornar la lista de préstamos', () => {
      gateway.list().subscribe((loans) => {
        expect(loans).toEqual(LOANS_MOCK);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush(LOANS_MOCK);
    });

    it('debería propagar un error si la petición HTTP falla', () => {
      gateway.list().subscribe({
        next: () => fail('No debería emitir datos cuando ocurre un error'),
        error: (error) => expect(error.status).toBe(500),
      });

      httpMock
        .expectOne(url)
        .flush({ message: 'Error interno del servidor' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getById', () => {
    it('debería realizar una petición GET con el id y retornar el préstamo', () => {
      gateway.getById(1).subscribe((loan) => {
        expect(loan).toEqual(LOANS_MOCK[0]);
      });

      const req = httpMock.expectOne(`${url}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(LOANS_MOCK[0]);
    });

    it('debería propagar el 404 si el préstamo no existe', () => {
      gateway.getById(999).subscribe({
        next: () => fail('No debería emitir datos cuando ocurre un error'),
        error: (error) => expect(error.status).toBe(404),
      });

      httpMock
        .expectOne(`${url}/999`)
        .flush({ message: 'No existe un préstamo con id 999' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    it('debería realizar una petición POST con el cuerpo del préstamo y retornar el creado', () => {
      const created = { id: 6, ...NEW_LOAN_MOCK, loanDate: '2026-10-15', status: 'ACTIVE' };

      gateway.create(NEW_LOAN_MOCK).subscribe((loan) => {
        expect(loan).toEqual(created);
      });

      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(NEW_LOAN_MOCK);
      req.flush(created);
    });
  });
});
