import { Book, NewBook } from '../domain/entities/book.entity.js';

/**
 * OpenAPI schemas for the API documentation.
 */
export const swaggerSchemas = {
  /**
   * Book entity schema.
   */
  Book: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Unique identifier of the book',
      },
      title: {
        type: 'string',
        example: 'Clean Code',
        description: 'Title of the book',
      },
      author: {
        type: 'string',
        example: 'Robert C. Martin',
        description: 'Author of the book',
      },
      isbn: {
        type: 'string',
        example: '978-0132350884',
        description: 'ISBN number of the book',
      },
      year: {
        type: 'integer',
        example: 2008,
        description: 'Publication year',
      },
      available: {
        type: 'boolean',
        example: true,
        description: 'Availability for loan',
      },
    },
    required: ['id', 'title', 'author', 'isbn', 'year', 'available'],
  },

  /**
   * NewBook (input for creation) schema.
   */
  NewBook: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Effective Java',
        description: 'Title of the book',
      },
      author: {
        type: 'string',
        example: 'Joshua Bloch',
        description: 'Author of the book',
      },
      isbn: {
        type: 'string',
        example: '978-0134685991',
        description: 'ISBN number of the book',
      },
      year: {
        type: 'integer',
        example: 2018,
        description: 'Publication year',
      },
    },
    required: ['title', 'author', 'isbn', 'year'],
  },

  /**
   * Standardized error response schema.
   */
  ErrorResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'El título es obligatorio y debe ser una cadena no vacía',
        description: 'Descriptive error message',
      },
    },
    required: ['message'],
  },
};
