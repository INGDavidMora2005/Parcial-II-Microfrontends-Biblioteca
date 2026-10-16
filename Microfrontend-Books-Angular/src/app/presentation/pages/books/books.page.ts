import { Component, OnInit, inject, signal } from '@angular/core';
import { CreateBookUseCase } from '../../../application/usecases/create-book.usecase';
import { GetBookByIdUseCase } from '../../../application/usecases/get-book-by-id.usecase';
import { ListBooksUseCase } from '../../../application/usecases/list-books.usecase';
import { Book, NewBook } from '../../../domain/entities/book.entity';
import { BookDetailComponent } from '../../components/book-detail/book-detail.component';
import { BookFormComponent } from '../../components/book-form/book-form.component';
import { BooksTableComponent } from '../../components/books-table/books-table.component';
import { BOOKS_PROVIDERS } from './books.providers';

export type ViewState = 'init' | 'loading' | 'success' | 'error';

/**
 * Página del microfrontend de Libros (se expone por Module Federation).
 * @remarks
 * Solo orquesta la vista e invoca casos de uso.
 */
@Component({
  selector: 'app-books',
  imports: [BooksTableComponent, BookDetailComponent, BookFormComponent],
  providers: BOOKS_PROVIDERS,
  templateUrl: './books.page.html',
})
export class BooksPage implements OnInit {
  private readonly listBooks = inject(ListBooksUseCase);
  private readonly getBookById = inject(GetBookByIdUseCase);
  private readonly createBook = inject(CreateBookUseCase);

  readonly books = signal<Book[]>([]);
  readonly state = signal<ViewState>('init');
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly selectedBook = signal<Book | null>(null);
  readonly showForm = signal(false);
  readonly formError = signal<string | null>(null);

  ngOnInit(): void {
    void this.loadBooks();
  }

  async loadBooks(): Promise<void> {
    this.state.set('loading');
    this.errorMessage.set(null);
    try {
      this.books.set(await this.listBooks.execute());
      this.state.set('success');
    } catch (error) {
      this.errorMessage.set(this.toMessage(error));
      this.state.set('error');
    }
  }

  async selectBook(id: number): Promise<void> {
    this.errorMessage.set(null);
    try {
      this.selectedBook.set(await this.getBookById.execute(id));
    } catch (error) {
      this.errorMessage.set(this.toMessage(error));
    }
  }

  closeDetail(): void {
    this.selectedBook.set(null);
  }

  openForm(): void {
    this.formError.set(null);
    this.successMessage.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
  }

  async saveBook(data: NewBook): Promise<void> {
    this.formError.set(null);
    try {
      const created = await this.createBook.execute(data);
      this.showForm.set(false);
      this.successMessage.set(`Libro "${created.title}" registrado correctamente.`);
      await this.loadBooks();
    } catch (error) {
      this.formError.set(this.toMessage(error));
    }
  }

  private toMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Ocurrió un error inesperado';
  }
}
