/**
 * Entidad de negocio: un libro del catálogo.
 * @remarks
 * Es una estructura pura, sin dependencias de Angular ni de HTTP.
 */
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  year: number;
  available: boolean;
}

/**
 * Datos necesarios para registrar un libro nuevo.
 * @remarks
 * El `id` y `available` los asigna el microservicio.
 */
export type NewBook = Omit<Book, 'id' | 'available'>;
