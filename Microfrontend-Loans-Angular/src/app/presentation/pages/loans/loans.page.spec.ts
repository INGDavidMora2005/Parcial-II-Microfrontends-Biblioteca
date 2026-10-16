import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { CreateLoanUseCase } from '../../../application/usecases/create-loan.usecase';
import { GetLoanByIdUseCase } from '../../../application/usecases/get-loan-by-id.usecase';
import { ListLoansUseCase } from '../../../application/usecases/list-loans.usecase';
import { Loan } from '../../../domain/entities/loan.entity';
import { LOANS_MOCK, NEW_LOAN_MOCK } from '../../../mocks/loans.mocks';
import { AlertComponent } from '../../components/alert/alert.component';
import { LoanDetailComponent } from '../../components/loan-detail/loan-detail.component';
import { LoanFormComponent } from '../../components/loan-form/loan-form.component';
import { LoansTableComponent } from '../../components/loans-table/loans-table.component';
import { LoansPage } from './loans.page';

describe('LoansPage', () => {
  let component: LoansPage;
  let fixture: ComponentFixture<LoansPage>;
  let listLoansUseCase: { execute: jest.Mock };
  let getLoanByIdUseCase: { execute: jest.Mock };
  let createLoanUseCase: { execute: jest.Mock };
  const createdLoan: Loan = { id: 3, ...NEW_LOAN_MOCK, loanDate: '2026-10-15', status: 'ACTIVE' };

  beforeEach(async () => {
    listLoansUseCase = { execute: jest.fn().mockReturnValue(of(LOANS_MOCK)) };
    getLoanByIdUseCase = { execute: jest.fn() };
    createLoanUseCase = { execute: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoansPage],
    })
      .overrideComponent(LoansPage, {
        set: {
          providers: [
            { provide: ListLoansUseCase, useValue: listLoansUseCase },
            { provide: GetLoanByIdUseCase, useValue: getLoanByIdUseCase },
            { provide: CreateLoanUseCase, useValue: createLoanUseCase },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LoansPage);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
    expect(component.state).toBe('init');
  });

  describe('Listar préstamos', () => {
    it('debería ejecutar el caso de uso de listar al iniciar', () => {
      fixture.detectChanges();
      expect(listLoansUseCase.execute).toHaveBeenCalled();
    });

    it('debería asignar los préstamos y pasarlos a la tabla', () => {
      fixture.detectChanges();

      expect(component.loans).toEqual(LOANS_MOCK);
      expect(component.state).toBe('success');
      const table = fixture.debugElement.query(By.directive(LoansTableComponent)).componentInstance;
      expect(table.loans).toEqual(LOANS_MOCK);
    });

    it('debería mostrar la alerta de carga mientras llegan los préstamos', () => {
      fixture.detectChanges();
      component.state = 'loading';
      fixture.detectChanges();

      const alert = fixture.debugElement.query(By.directive(AlertComponent)).componentInstance;
      expect(alert.alertState).toBe('loading');
      expect(alert.text).toBe('Cargando Préstamos...');
    });

    it('debería manejar el error cuando falla el listado', () => {
      const errorResponse = new Error('Error al cargar préstamos');
      jest.spyOn(console, 'error').mockImplementation(() => {});
      listLoansUseCase.execute.mockReturnValue(throwError(() => errorResponse));

      fixture.detectChanges();

      expect(console.error).toHaveBeenCalledWith(errorResponse);
      expect(component.state).toBe('error');
      expect(component.loans.length).toBe(0);
      expect(fixture.nativeElement.textContent).toContain('Error al Cargar los Préstamos');
    });
  });

  describe('Detalle del préstamo', () => {
    beforeEach(() => fixture.detectChanges());

    it('debería consultar el detalle y mostrarlo al seleccionar un préstamo', () => {
      getLoanByIdUseCase.execute.mockReturnValue(of(LOANS_MOCK[0]));

      component.onSelectLoan(1);
      fixture.detectChanges();

      expect(getLoanByIdUseCase.execute).toHaveBeenCalledWith(1);
      expect(component.selectedLoan).toEqual(LOANS_MOCK[0]);
      expect(component.detailState).toBe('success');
      const detail = fixture.debugElement.query(By.directive(LoanDetailComponent)).componentInstance;
      expect(detail.loan).toEqual(LOANS_MOCK[0]);
    });

    it('debería consultar el detalle cuando la tabla emite selectLoan', () => {
      getLoanByIdUseCase.execute.mockReturnValue(of(LOANS_MOCK[1]));

      fixture.debugElement.query(By.directive(LoansTableComponent)).componentInstance.selectLoan.emit(2);

      expect(getLoanByIdUseCase.execute).toHaveBeenCalledWith(2);
    });

    it('debería mostrar error si falla la consulta del detalle', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      getLoanByIdUseCase.execute.mockReturnValue(throwError(() => ({ status: 404 })));

      component.onSelectLoan(999);
      fixture.detectChanges();

      expect(component.selectedLoan).toBeNull();
      expect(component.detailState).toBe('error');
      expect(fixture.nativeElement.textContent).toContain('Error al Cargar el Detalle del Préstamo');
    });

    it('debería cerrar el detalle', () => {
      getLoanByIdUseCase.execute.mockReturnValue(of(LOANS_MOCK[0]));
      component.onSelectLoan(1);
      fixture.detectChanges();

      fixture.debugElement.query(By.directive(LoanDetailComponent)).componentInstance.closeDetail.emit();
      fixture.detectChanges();

      expect(component.selectedLoan).toBeNull();
      expect(component.detailState).toBe('init');
      expect(fixture.debugElement.query(By.directive(LoanDetailComponent))).toBeNull();
    });
  });

  describe('Registrar préstamo', () => {
    beforeEach(() => fixture.detectChanges());

    it('debería registrar el préstamo, agregarlo a la tabla y limpiar el formulario', () => {
      createLoanUseCase.execute.mockReturnValue(of(createdLoan));
      const form = fixture.debugElement.query(By.directive(LoanFormComponent)).componentInstance as LoanFormComponent;
      const spyReset = jest.spyOn(form, 'reset');

      form.submitLoan.emit(NEW_LOAN_MOCK);
      fixture.detectChanges();

      expect(createLoanUseCase.execute).toHaveBeenCalledWith(NEW_LOAN_MOCK);
      expect(component.loans).toEqual([...LOANS_MOCK, createdLoan]);
      expect(component.createState).toBe('success');
      expect(spyReset).toHaveBeenCalled();
      expect(fixture.nativeElement.textContent).toContain('Préstamo registrado correctamente');
    });

    it('debería mostrar el mensaje de error que envía el microservicio', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      createLoanUseCase.execute.mockReturnValue(
        throwError(() => ({ error: { message: 'El título del libro es obligatorio' } })),
      );

      component.onCreateLoan(NEW_LOAN_MOCK);
      fixture.detectChanges();

      expect(component.createState).toBe('error');
      expect(component.createErrorMessage).toBe('El título del libro es obligatorio');
      expect(fixture.nativeElement.textContent).toContain('El título del libro es obligatorio');
    });

    it('debería usar un mensaje genérico si el error no trae mensaje', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      createLoanUseCase.execute.mockReturnValue(throwError(() => ({})));

      component.onCreateLoan(NEW_LOAN_MOCK);

      expect(component.createErrorMessage).toBe('Error al registrar el préstamo');
    });

    it('debería mostrar la alerta de carga y bloquear el formulario mientras registra', () => {
      component.createState = 'loading';
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Registrando Préstamo...');
      const form = fixture.debugElement.query(By.directive(LoanFormComponent)).componentInstance;
      expect(form.saving).toBe(true);
    });
  });
});

describe('LoansPage con sus providers reales', () => {
  it('debería enlazar LoanRepository con LoanApiGateway y pedir los préstamos al microservicio', async () => {
    await TestBed.configureTestingModule({
      imports: [LoansPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    const httpMock = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(LoansPage);

    fixture.detectChanges();
    httpMock.expectOne('http://localhost:3003/api/loans').flush(LOANS_MOCK);

    expect(fixture.componentInstance.loans).toEqual(LOANS_MOCK);
    httpMock.verify();
  });
});
