import { Component } from '@angular/core';
import { BooksPage } from './presentation/pages/books/books.page';

/**
 * Componente raíz, usado solo al ejecutar el microfrontend de forma independiente.
 */
@Component({
  selector: 'app-root',
  imports: [BooksPage],
  template: '<app-books />',
})
export class App {}
