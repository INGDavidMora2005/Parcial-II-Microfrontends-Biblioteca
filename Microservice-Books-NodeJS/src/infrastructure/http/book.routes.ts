import { Router } from 'express';
import { BookController } from './book.controller';

/**
 * Rutas del recurso Book.
 * @remarks
 * Cada ruta incluye anotaciones Swagger para la generación automática de documentación.
 */
export class BookRoutes {
  static routes(controller: BookController): Router {
    const router = Router();

    /**
     * @openapi
     * /api/books:
     *   get:
     *     summary: Obtener todos los libros.
     *     tags: [Books]
     *     responses:
     *       200:
     *         description: Lista de libros.
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Book'
     */
    router.get('/', controller.list);

    /**
     * @openapi
     * /api/books/{id}:
     *   get:
     *     summary: Obtener un libro por ID.
     *     tags: [Books]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Identificador del libro.
     *     responses:
     *       200:
     *         description: Libro encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       400:
     *         description: Id inválido.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     *       404:
     *         description: Libro no encontrado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.get('/:id', controller.getById);

    /**
     * @openapi
     * /api/books:
     *   post:
     *     summary: Crear un nuevo libro.
     *     tags: [Books]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/NewBook'
     *     responses:
     *       201:
     *         description: Libro creado.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       400:
     *         description: Datos inválidos.
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ErrorResponse'
     */
    router.post('/', controller.create);

    return router;
  }
}
