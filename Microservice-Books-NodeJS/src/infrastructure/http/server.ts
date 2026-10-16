import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Router } from 'express';
import swaggerUiExpress from 'swagger-ui-express';
import { swaggerSpec } from '../../config/swagger.js';
import { envs } from '../../config/envs.js';

/**
 * Servidor Express configurado con Clean Architecture.
 * @remarks
 * No contiene lógica de negocio. Solo orquesta middlewares y montaje de rutas.
 */
export class Server {
  private readonly app = express();
  private readonly port: number;
  private router: Router | null = null;

  constructor() {
    this.port = envs.PORT;
  }

  setRouter(router: Router): void {
    this.router = router;
  }

  async start(): Promise<void> {
    // Middlewares
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: ['http://localhost:4201', 'http://localhost:4200'],
      })
    );

    // Documentación Swagger
    this.app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

    // Rutas
    if (this.router) {
      this.app.use(this.router);
    }

    // Middleware de captura de JSON inválido
    this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof SyntaxError && err.message.includes('JSON')) {
        res.status(400).json({ message: 'JSON inválido' });
      } else {
        res.status(500).json({ message: 'Error interno del servidor' });
      }
    });

    this.app.listen(this.port, () => {
      console.log(`🚀 Servicio de libros corriendo en http://localhost:${this.port}`);
      console.log(`📚 Documentación Swagger disponible en http://localhost:${this.port}/api/docs`);
    });
  }
}
