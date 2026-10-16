import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BadgeAtom, BadgeType, ButtonAtom } from '@brejcha13320/design-system-bootstrap';
import { Loan, LoanStatus } from '../../../domain/entities/loan.entity';

/**
 * Componente de tabla de préstamos.
 *
 * Muestra el listado de préstamos con su libro, socio, fechas y un badge
 * que indica el estado de cada préstamo.
 *
 * @remarks
 * Recibe los préstamos desde `LoansPage` a través del Input `loans` y avisa
 * con el Output `selectLoan` cuando el usuario quiere ver el detalle de uno.
 *
 * @example
 * ```html
 * <app-loans-table [loans]="loans" (selectLoan)="onSelectLoan($event)"></app-loans-table>
 * ```
 */
@Component({
  selector: 'app-loans-table',
  templateUrl: './loans-table.component.html',
  imports: [BadgeAtom, ButtonAtom],
})
export class LoansTableComponent {
  /**
   * Listado de préstamos que se mostrarán en la tabla.
   * @type {Loan[]}
   */
  @Input() loans: Loan[] = [];

  /**
   * Evento que emite el id del préstamo seleccionado para ver su detalle.
   */
  @Output() selectLoan = new EventEmitter<number>();

  /**
   * Mapeo del estado del préstamo al color del badge.
   * @type {Record<LoanStatus, BadgeType>}
   * @remarks
   * - 'ACTIVE' → 'success' (verde)
   * - 'RETURNED' → 'secondary' (gris)
   */
  statusMap: Record<LoanStatus, BadgeType> = {
    ACTIVE: 'success',
    RETURNED: 'secondary',
  };

  /**
   * Texto en español que se muestra para cada estado.
   * @type {Record<LoanStatus, string>}
   */
  statusText: Record<LoanStatus, string> = {
    ACTIVE: 'Activo',
    RETURNED: 'Devuelto',
  };

  /**
   * Emite el id del préstamo que el usuario quiere ver.
   *
   * @param id Identificador del préstamo.
   */
  onSelect(id: number): void {
    this.selectLoan.emit(id);
  }
}
