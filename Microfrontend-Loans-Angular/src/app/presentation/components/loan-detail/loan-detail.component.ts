import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BadgeAtom, BadgeType, ButtonAtom, IconAtom } from '@brejcha13320/design-system-bootstrap';
import { Loan, LoanStatus } from '../../../domain/entities/loan.entity';

/**
 * Componente de detalle de un préstamo.
 *
 * Muestra todos los datos de un préstamo consultado con `GET /api/loans/:id`.
 *
 * @example
 * ```html
 * <app-loan-detail [loan]="selectedLoan" (closeDetail)="onCloseDetail()"></app-loan-detail>
 * ```
 */
@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.component.html',
  imports: [BadgeAtom, ButtonAtom, IconAtom],
})
export class LoanDetailComponent {
  /**
   * Préstamo que se va a mostrar.
   *
   * @required
   */
  @Input({ required: true }) loan!: Loan;

  /**
   * Evento que avisa a la página que el usuario cerró el detalle.
   */
  @Output() closeDetail = new EventEmitter<void>();

  /**
   * Mapeo del estado del préstamo al color del badge.
   * @type {Record<LoanStatus, BadgeType>}
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
   * Emite el evento para cerrar el detalle.
   */
  onClose(): void {
    this.closeDetail.emit();
  }
}
