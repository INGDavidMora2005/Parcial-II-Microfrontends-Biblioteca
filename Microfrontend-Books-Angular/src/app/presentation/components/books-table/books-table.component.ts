import { Component, input, output } from '@angular/core';
import { Book } from '../../../domain/entities/book.entity';

/**
 * Tabla de presentación del catálogo. No conoce casos de uso:
 * recibe los libros y notifica cuál se quiere ver en detalle.
 */
@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
})
export class BooksTableComponent {
  readonly books = input.required<Book[]>();
  readonly selected = output<number>();

  onSelect(id: number): void {
    this.selected.emit(id);
  }
}
