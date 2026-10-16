import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewBook } from '../../../domain/entities/book.entity';

/**
 * Formulario para registrar un libro. Valida en la vista y
 * emite los datos; no sabe cómo se guardan.
 */
@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule],
  templateUrl: './book-form.component.html',
})
export class BookFormComponent {
  readonly errorMessage = input<string | null>(null);
  readonly submitted = output<NewBook>();
  readonly cancelled = output<void>();

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    author: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    isbn: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  isInvalid(name: 'title' | 'author' | 'isbn' | 'year'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { title, author, isbn, year } = this.form.getRawValue();
    this.submitted.emit({ title, author, isbn, year: Number(year) });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
