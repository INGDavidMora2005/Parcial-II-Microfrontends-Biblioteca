/**
 * Configuración de acceso al microservicio de préstamos.
 *
 * @remarks
 * El microservicio `Microservice-Loans-SpringBoot` corre en el puerto 3003
 * con el prefijo `/api`.
 */
export const API_CONFIG = {
  /** URL base del microservicio de préstamos */
  baseUrl: 'http://localhost:3003/api',

  /** Recurso de préstamos dentro de la API */
  loansPath: '/loans',
};
