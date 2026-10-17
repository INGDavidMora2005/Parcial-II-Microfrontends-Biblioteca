import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ContainerAtom } from '@brejcha13320/design-system-bootstrap';
import { CreateLoanUseCase } from '../../../application/usecases/create-loan.usecase';
import { GetLoanByIdUseCase } from '../../../application/usecases/get-loan-by-id.usecase';
import { ListLoansUseCase } from '../../../application/usecases/list-loans.usecase';
import { Loan, NewLoan } from '../../../domain/entities/loan.entity';
import { LoanRepository } from '../../../domain/repositories/loan.repository';
import { LoanApiGateway } from '../../../infrastructure/gateways/loan-api.gateway';
import { AlertComponent } from '../../components/alert/alert.component';
import { LoanDetailComponent } from '../../components/loan-detail/loan-detail.component';
import { LoanFormComponent } from '../../components/loan-form/loan-form.component';
import { LoansTableComponent } from '../../components/loans-table/loans-table.component';
import { State } from '../../interfaces/state.interface';

/**
 * Página de préstamos.
 *
 * Lista los préstamos, muestra el detalle de uno y permite registrar préstamos nuevos.
 *
 * @remarks
 * Es el componente que se expone por Module Federation (`./LoansPage`).
 * Solo usa casos de uso: nunca habla directo con `HttpClient`.
 *
 * El enlace `LoanRepository → LoanApiGateway` se declara en sus `providers`
 * porque, cuando el host carga este microfrontend, el `app.config.ts` del MF
 * no se ejecuta.
 */
@Component({
  selector: 'app-loans',
  templateUrl: './loans.page.html',
  imports: [ContainerAtom, AlertComponent, LoansTableComponent, LoanDetailComponent, LoanFormComponent],
  providers: [
    { provide: LoanRepository, useClass: LoanApiGateway },
    ListLoansUseCase,
    GetLoanByIdUseCase,
    CreateLoanUseCase,
  ],
})
export class LoansPage implements OnInit {
  /**
   * Listado de préstamos obtenidos con el caso de uso de listar.
   * @type {Loan[]}
   */
  loans: Loan[] = [];

  /**
   * Préstamo seleccionado para ver su detalle.
   */
  selectedLoan: Loan | null = null;

  /**
   * Estado de la carga del listado.
   *
   * @default 'init'
   */
  state: State = 'init';

  /**
   * Estado de la consulta del detalle.
   *
   * @default 'init'
   */
  detailState: State = 'init';

  /**
   * Estado del registro de un préstamo.
   *
   * @default 'init'
   */
  createState: State = 'init';

  /**
   * Mensaje de error que devolvió el microservicio al registrar.
   */
  createErrorMessage: string = '';

  /**
   * Referencia al formulario, para limpiarlo después de registrar.
   */
  @ViewChild(LoanFormComponent) loanForm?: LoanFormComponent;

  /** Caso de uso para listar préstamos */
  private readonly listLoansUseCase = inject(ListLoansUseCase);

  /** Caso de uso para obtener el detalle de un préstamo */
  private readonly getLoanByIdUseCase = inject(GetLoanByIdUseCase);

  /** Caso de uso para registrar un préstamo */
  private readonly createLoanUseCase = inject(CreateLoanUseCase);

  /**
   * Inicializa la página cargando el listado de préstamos.
   */
  ngOnInit(): void {
    this.loadLoans();
  }

  /**
   * Carga el listado de préstamos y actualiza `state`.
   */
  loadLoans(): void {
    this.state = 'loading';
    this.listLoansUseCase.execute().subscribe({
      next: (loans) => {
        this.loans = loans;
        this.state = 'success';
      },
      error: (error) => {
        console.error(error);
        this.state = 'error';
      },
    });
  }

  /**
   * Consulta el detalle del préstamo seleccionado en la tabla.
   *
   * @param id Identificador del préstamo.
   */
  onSelectLoan(id: number): void {
    this.detailState = 'loading';
    this.getLoanByIdUseCase.execute(id).subscribe({
      next: (loan) => {
        this.selectedLoan = loan;
        this.detailState = 'success';
      },
      error: (error) => {
        console.error(error);
        this.selectedLoan = null;
        this.detailState = 'error';
      },
    });
  }

  /**
   * Cierra el panel de detalle.
   */
  onCloseDetail(): void {
    this.selectedLoan = null;
    this.detailState = 'init';
  }

  /**
   * Registra un préstamo, lo agrega a la tabla y limpia el formulario.
   *
   * @param newLoan Datos del préstamo que envió el formulario.
   */
  onCreateLoan(newLoan: NewLoan): void {
    this.createState = 'loading';
    this.createErrorMessage = '';
    this.createLoanUseCase.execute(newLoan).subscribe({
      next: (loan) => {
        this.loans = [...this.loans, loan];
        this.createState = 'success';
        this.loanForm?.reset();
      },
      error: (error: { error?: { message?: string } }) => {
        console.error(error);
        this.createErrorMessage = error.error?.message ?? 'Error al registrar el préstamo';
        this.createState = 'error';
      },
    });
  }
}
