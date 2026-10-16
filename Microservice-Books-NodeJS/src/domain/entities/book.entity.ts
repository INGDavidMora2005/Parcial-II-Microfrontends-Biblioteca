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
 * Datos necesarios para crear un nuevo libro.
 * @remarks
 * Excluye `id` (lo genera la infraestructura) y `available`
 * (todo libro nuevo inicia disponible).
 */
export type NewBook = Omit<Book, 'id' | 'available'>;