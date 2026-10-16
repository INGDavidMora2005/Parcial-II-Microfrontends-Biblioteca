/**
 * Error personalizado para la capa de dominio.
 * @remarks
 * Cada error lleva un código de estado HTTP y un mensaje.
 */
export class CustomError extends Error {
  /**
   * Código HTTP asociado al error.
   */
  public readonly statusCode: number;

  /**
   * Crea una instancia de CustomError.
   * @param statusCode - Código HTTP.
   * @param message - Mensaje descriptivo.
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  /**
   * Factory para una Bad Request (400).
   * @param message - Mensaje explicativo.
   * @returns CustomError con 400.
   */
  static badRequest(message: string): CustomError {
    return new CustomError(400, message);
  }

  /**
   * Factory para una Not Found (404).
   * @param message - Mensaje explicativo.
   * @returns CustomError con 404.
   */
  static notFound(message: string): CustomError {
    return new CustomError(404, message);
  }
}
