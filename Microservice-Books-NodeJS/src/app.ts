import { BookMemoryDatasource } from './infrastructure/datasources/book.memory.datasource.js';
import { BookRepositoryImpl } from './infrastructure/repositories/book.repository.impl.js';
import { ListBooksUseCase } from './application/usecases/list-books.usecase.js';
import { GetBookByIdUseCase } from './application/usecases/get-book-by-id.usecase.js';
import { CreateBookUseCase } from './application/usecases/create-book.usecase.js';
import { BookController } from './infrastructure/http/book.controller.js';
import { AppRoutes } from './infrastructure/http/routes.js';
import { Server } from './infrastructure/http/server.js';

/**
 * Composition root de la aplicación.
 * @remarks
 * Instancia las dependencias y las inyecta en cascada:
 * Datasource -> Repositorio -> Casos de Uso -> Controlador -> Rutas -> Servidor.
 */
async function bootstrap() {
  const datasource = new BookMemoryDatasource();
  const bookRepository = new BookRepositoryImpl(datasource);

  const listBooksUseCase = new ListBooksUseCase(bookRepository);
  const getBookByIdUseCase = new GetBookByIdUseCase(bookRepository);
  const createBookUseCase = new CreateBookUseCase(bookRepository);

  const bookController = new BookController(
    listBooksUseCase,
    getBookByIdUseCase,
    createBookUseCase
  );

  const router = AppRoutes.routes(bookController);

  const server = new Server();
  server.setRouter(router);
  await server.start();
}

bootstrap().catch((err) => {
  console.error('❌ Error al iniciar el microservicio:', err);
  process.exit(1);
});
