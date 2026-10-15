/**
 * Representa un libro en el sistema.
 * @remarks
 * Esta entidad es pura y no tiene dependencias externas.
 */
export interface Book {
  /** Identificador único del libro */
  id: number;
  /** Título del libro */
  title: string;
  /** Autor del libro */
  author: string;
  /** Número ISBN del libro */
  isbn: string;
  /** Año de publicación */
  year: number;
  /** Disponibilidad para préstamo */
  available: boolean;
}

/**
 * Datos necesarios para crear un nuevo libro (sin id).
 * @remarks
 * El id se genera automáticamente en la capa de infraestructura.
 */
export type NewBook = Omit<Book, 'id'>;
