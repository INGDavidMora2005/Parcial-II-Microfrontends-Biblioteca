/** Forma del libro tal como lo envía el microservicio. */
export interface BookDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
  year: number;
  available: boolean;
}

/** Cuerpo que espera el microservicio para crear un libro. */
export interface NewBookDto {
  title: string;
  author: string;
  isbn: string;
  year: number;
}
