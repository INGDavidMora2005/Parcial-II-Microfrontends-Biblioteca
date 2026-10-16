import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { NewMember } from '../../../domain/entities/member.entity';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss',
})
export class MemberFormComponent {

  @Input() saving = false;

  @Output() submitted = new EventEmitter<NewMember>();
  @Output() cancelled = new EventEmitter<void>();

  form: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  get fullName() {
    return this.form.get('fullName')!;
  }

  get email() {
    return this.form.get('email')!;
  }

  get phone() {
    return this.form.get('phone')!;
  }

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

  onCancel() {
    this.cancelled.emit();
  }
}
