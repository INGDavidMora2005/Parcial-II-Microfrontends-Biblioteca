import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerSchemas } from './swagger.schemas';
import { envs } from './envs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio de Libros',
      version: '1.0.0',
      description: 'API REST para la gestión de libros del sistema de Biblioteca.',
    },
    servers: [
      {
        url: `http://localhost:${envs.PORT}`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      schemas: swaggerSchemas,
    },
  },
  apis: ['./src/infrastructure/http/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);