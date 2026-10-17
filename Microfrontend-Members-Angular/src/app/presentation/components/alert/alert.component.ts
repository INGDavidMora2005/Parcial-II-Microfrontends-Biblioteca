import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgIf],
  templateUrl: './alert.component.html',
})
/**
 * Alerta reutilizable para mostrar mensajes de error o de éxito.
 */
export class AlertComponent {

  /** Tipo de alerta. */
  @Input() type: 'error' | 'success' = 'error';

  /** Texto a mostrar. */
  @Input() message = '';
}