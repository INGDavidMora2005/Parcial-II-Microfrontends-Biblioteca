import { Provider } from '@angular/core';
import { CreateBookUseCase } from '../../../application/usecases/create-book.usecase';
import { GetBookByIdUseCase } from '../../../application/usecases/get-book-by-id.usecase';
import { ListBooksUseCase } from '../../../application/usecases/list-books.usecase';
import { BookRepository } from '../../../domain/repositories/book.repository';
import { BookApiGateway } from '../../../infrastructure/gateways/book-api.gateway';

/**
 * Raíz de composición del microfrontend.
 * @remarks
 * Enlaza el puerto (`BookRepository`) con su implementación (`BookApiGateway`)
 * y construye los casos de uso. Se declara en el componente de la página porque,
 * al cargarse desde el host, el `app.config.ts` del microfrontend no se ejecuta.
 */
export const BOOKS_PROVIDERS: Provider[] = [
  { provide: BookRepository, useClass: BookApiGateway },
  {
    provide: ListBooksUseCase,
    useFactory: (repository: BookRepository) => new ListBooksUseCase(repository),
    deps: [BookRepository],
  },
  {
    provide: GetBookByIdUseCase,
    useFactory: (repository: BookRepository) => new GetBookByIdUseCase(repository),
    deps: [BookRepository],
  },
  {
    provide: CreateBookUseCase,
    useFactory: (repository: BookRepository) => new CreateBookUseCase(repository),
    deps: [BookRepository],
  },
];
