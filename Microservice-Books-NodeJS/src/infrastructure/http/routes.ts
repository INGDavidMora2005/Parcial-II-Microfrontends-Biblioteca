import { Router } from 'express';
import { BookController } from './book.controller.js';

/**
 * Configurador global de rutas de la aplicación.
 * @remarks
 * Monta los routers de cada recurso bajo su path base.
 */
export class AppRoutes {
  /**
   * Crea y configura el router principal.
   * @param bookController - Controlador de libros inyectado.
   * @returns Router de Express con todas las rutas montadas.
   */
  static routes(bookController: BookController): Router {
    const router = Router();

    // Importamos aquí para evitar referencias circulares en tiempo de compilación.
    // Esto es seguro porque las rutas de libro no dependen de AppRoutes.
    const { BookRoutes } = require('./book.routes.js');
    router.use('/api/books', BookRoutes.routes(bookController));

    return router;
  }
}
