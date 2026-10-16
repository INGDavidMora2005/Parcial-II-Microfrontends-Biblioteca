import { Component, input, output } from '@angular/core';
import { Book } from '../../../domain/entities/book.entity';

/**
 * Panel con el detalle de un libro.
 */
@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
})
export class BookDetailComponent {
  readonly book = input.required<Book>();
  readonly closed = output<void>();

  onClose(): void {
    this.closed.emit();
  }
}
