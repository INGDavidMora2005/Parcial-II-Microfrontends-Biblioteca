import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { NewMember } from '../../../domain/entities/member.entity';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './member-form.component.html',
})
/**
 * Formulario reactivo para registrar un socio nuevo.
 */
export class MemberFormComponent {

  /** Indica si hay un guardado en curso (deshabilita el botón). */
  @Input() saving = false;

  /** Emite los datos del socio cuando el formulario es válido. */
  @Output() submitted = new EventEmitter<NewMember>();

  /** Emite al cancelar el formulario. */
  @Output() cancelled = new EventEmitter<void>();

  /** Grupo de controles del formulario. */
  form: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  /** Control del nombre completo. */
  get fullName() {
    return this.form.get('fullName')!;
  }

  /** Control del correo electrónico. */
  get email() {
    return this.form.get('email')!;
  }

  /** Control del teléfono. */
  get phone() {
    return this.form.get('phone')!;
  }

  /** Emite el socio si el formulario es válido. */
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const value: NewMember = {
      fullName: this.fullName.value?.trim() ?? '',
      email: this.email.value?.trim() ?? '',
      phone: '',
    };
    const phone = this.phone.value?.trim();
    if (phone) {
      value.phone = phone;
    } else {
      value.phone = '';
    }
    this.submitted.emit(value);
  }

  /** Emite la cancelación del formulario. */
  onCancel() {
    this.cancelled.emit();
  }
}
