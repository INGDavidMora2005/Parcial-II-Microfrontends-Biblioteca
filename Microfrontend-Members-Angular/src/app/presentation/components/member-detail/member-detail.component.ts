import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Member } from '../../../domain/entities/member.entity';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [],
  templateUrl: './member-detail.component.html',
})
/**
 * Tarjeta con el detalle de un socio seleccionado.
 */
export class MemberDetailComponent {

  /** Socio a mostrar; `null` cuando no hay selección. */
  @Input() member: Member | null = null;

  /** Emite al cerrar el detalle. */
  @Output() closed = new EventEmitter<void>();

  /** Notifica el cierre del detalle. */
  close() {
    this.closed.emit();
  }
}
