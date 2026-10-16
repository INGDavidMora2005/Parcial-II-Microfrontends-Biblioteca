import { Request, Response, Router } from 'express';
import { ListBooksUseCase } from '../../application/usecases/list-books.usecase.js';
import { GetBookByIdUseCase } from '../../application/usecases/get-book-by-id.usecase.js';
import { CreateBookUseCase } from '../../application/usecases/create-book.usecase.js';
import { CustomError } from '../../domain/errors/custom.error.js';
import { handleError } from '../../domain/errors/handle.error.js';

/**
 * Controlador REST para la entidad Libro.
 * @remarks
 * Uso arrow functions para que "this" se mantenga al ser utilizado como callback.
 */
export class BookController {
  constructor(
    private readonly listBooksUseCase: ListBooksUseCase,
    private readonly getBookByIdUseCase: GetBookByIdUseCase,
    private readonly createBookUseCase: CreateBookUseCase
  ) {}

  /**
   * GET /api/books
   */
  list = async (_req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.listBooksUseCase.execute();
      res.status(200).json(books);
    } catch (err) {
      const { statusCode, message } = handleError(err);
      res.status(statusCode).json({ message });
    }
  };

  /**
   * GET /api/books/:id
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const id = Number.parseInt(idParam, 10);
      if (!idParam || !Number.isFinite(id) || id <= 0 || !/^\d+$/.test(idParam)) {
        throw CustomError.badRequest('El id debe ser un número entero positivo');
      }
      const book = await this.getBookByIdUseCase.execute(id);
      res.status(200).json(book);
    } catch (err) {
      const { statusCode, message } = handleError(err);
      res.status(statusCode).json({ message });
    }
  };

  /**
   * POST /api/books
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body ?? {};
      const book = await this.createBookUseCase.execute(body);
      res.status(201).json(book);
    } catch (err) {
      const { statusCode, message } = handleError(err);
      res.status(statusCode).json({ message });
    }
  };
}
