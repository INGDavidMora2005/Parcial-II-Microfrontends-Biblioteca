import { CustomError } from './custom.error.js';

/**
 * Procesa errores desconocidos o personalizados y los normaliza.
 * @remarks
 * Función pura que no depende de ningún framework externo.
 *
 * @param error - El error capturado.
 * @returns Objeto con statusCode y mensaje.
 *
 * @example
 * const result = handleError(new CustomError(404, 'No encontrado'));
 * // { statusCode: 404, message: 'No encontrado' }
 */
export function handleError(error: unknown): { statusCode: number; message: string } {
  if (error instanceof CustomError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
    };
  }

  return {
    statusCode: 500,
    message: 'Error interno del servidor',
  };
}
