import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import type { Member } from '../../../domain/entities/member.entity';

@Component({
  selector: 'app-members-table',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './members-table.component.html',
})
/**
 * Tabla con el listado de socios.
 */
export class MembersTableComponent {

  /** Socios a listar. */
  @Input() members: Member[] = [];

  /** Emite el id del socio seleccionado. */
  @Output() memberSelected = new EventEmitter<number>();

  /** Función de tracking por id para el `*ngFor`. */
  trackById = (_index: number, member: Member) => member.id;

  /** Emite el id del socio seleccionado. */
  select(member: Member) {
    this.memberSelected.emit(member.id);
  }
}