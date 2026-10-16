import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonAtom, IconAtom } from '@brejcha13320/design-system-bootstrap';
import { NewLoan } from '../../../domain/entities/loan.entity';

/**
 * Componente de formulario para registrar un préstamo.
 *
 * Pide el título del libro, el nombre del socio y la fecha de devolución.
 *
 * @remarks
 * Solo valida que los campos estén llenos; las reglas de negocio las valida
 * el microservicio. Cuando el formulario es válido emite `submitLoan` y la
 * página decide qué caso de uso ejecutar.
 *
 * @example
 * ```html
 * <app-loan-form [saving]="createState === 'loading'" (submitLoan)="onCreateLoan($event)"></app-loan-form>
 * ```
 */
@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  imports: [ReactiveFormsModule, ButtonAtom, IconAtom],
})
export class LoanFormComponent {
  /**
   * Indica si el préstamo se está guardando, para bloquear el envío.
   *
   * @default false
   */
  @Input() saving: boolean = false;

  /**
   * Evento que emite los datos del préstamo cuando el formulario es válido.
   */
  @Output() submitLoan = new EventEmitter<NewLoan>();

  /**
   * Constructor de formularios reactivos de Angular.
   */
  private readonly formBuilder = inject(FormBuilder);

  /**
   * Formulario reactivo con los tres campos obligatorios del préstamo.
   */
  form = this.formBuilder.nonNullable.group({
    bookTitle: ['', Validators.required],
    memberName: ['', Validators.required],
    dueDate: ['', Validators.required],
  });

  /**
   * Indica si un campo debe mostrarse como inválido.
   *
   * @param field Nombre del campo del formulario.
   * @returns `true` si el campo es inválido y el usuario ya lo tocó.
   */
  isInvalid(field: keyof NewLoan): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  /**
   * Envía el formulario: si es válido emite `submitLoan`; si no, marca los errores.
   */
  onSubmit(): void {
    if (this.saving) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitLoan.emit(this.form.getRawValue());
  }

  /**
   * Limpia el formulario después de registrar un préstamo.
   */
  reset(): void {
    this.form.reset();
  }
}
