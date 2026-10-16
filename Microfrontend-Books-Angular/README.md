# Microfrontend de Libros (Angular + Module Federation)

Microfrontend remoto del sistema de Biblioteca. Muestra el catálogo de libros, el detalle de un libro y permite registrar libros nuevos. Se integra al host (`Client-Host-Angular`) mediante Webpack Module Federation y consume el microservicio `Microservice-Books-NodeJS`.

## Puertos y conexiones

| Elemento | Valor |
|---|---|
| Puerto del microfrontend | **4201** |
| Archivo remoto | `http://localhost:4201/remoteEntry.js` |
| Nombre federado | `mf-books` |
| Módulo expuesto | `./BooksPage` (clase `BooksPage`) |
| Ruta en el host | `/books` |
| Microservicio que consume | `Microservice-Books-NodeJS` en `http://localhost:3001/api/books` |

## Ejecución

```bash
npm install
npm start            # http://localhost:4201
npm test             # pruebas unitarias con cobertura (Jest)
npm run build        # compilación de producción
```

Requiere que el microservicio de libros esté corriendo en el puerto 3001 para mostrar datos. Para verlo integrado, levantar también el host (puerto 4200).

## Clean Architecture

Las dependencias apuntan hacia adentro: `presentation` e `infrastructure` dependen de `application` y `domain`; `domain` no depende de nada.

```
src/app/
├── domain/
│   ├── entities/book.entity.ts            Entidad Book y tipo NewBook
│   └── repositories/book.repository.ts    Puerto: clase abstracta BookRepository
├── application/usecases/
│   ├── list-books.usecase.ts              Caso de uso 1: listar libros
│   ├── get-book-by-id.usecase.ts          Caso de uso 2: obtener libro por id
│   └── create-book.usecase.ts             Caso de uso 3: registrar libro
├── infrastructure/
│   ├── gateways/book-api.gateway.ts       API Gateway: implementa BookRepository con HttpClient
│   ├── dtos/book.dto.ts                   Formato del microservicio
│   ├── mappers/book.mapper.ts             DTO <-> entidad
│   └── config/api.config.ts               URL base del microservicio
├── presentation/
│   ├── pages/books/                       BooksPage (se expone por Module Federation) y providers
│   └── components/                        books-table, book-detail, book-form
└── app.ts / app.config.ts                 Solo para la ejecución independiente
```

### Reglas que se cumplen

- Los casos de uso son clases TypeScript puras (sin decoradores ni Angular); reciben el repositorio por constructor y exponen un único método `execute`.
- `domain` y `application` no importan nada de `infrastructure`, `presentation` ni `@angular/*`.
- La página solo invoca casos de uso; nunca usa `HttpClient`.

### Composición de dependencias

`presentation/pages/books/books.providers.ts` enlaza el puerto con su implementación (`BookRepository` -> `BookApiGateway`) y construye los casos de uso con `useFactory`. Esos providers se declaran en el componente `BooksPage` y no en `app.config.ts`, porque al cargarse desde el host el `app.config.ts` del microfrontend no se ejecuta. `HttpClient` lo aporta el host.

## Flujo de un caso de uso (crear libro)

1. `BookFormComponent` valida y emite los datos.
2. `BooksPage.saveBook` invoca `CreateBookUseCase.execute`.
3. El caso de uso valida y normaliza y llama a `BookRepository.create`.
4. `BookApiGateway.create` hace `POST /api/books` y mapea la respuesta a entidad.
5. La página cierra el formulario, muestra el mensaje de éxito y recarga la lista.

## Pruebas

Jest con `jest-preset-angular`. Cobertura mínima exigida: 90 % (configurada en `jest.config.js`); la cobertura actual es 100 %. Se prueban los casos de uso, el mapper, el gateway (con `HttpTestingController`), los componentes y la página recorriendo la cadena completa hasta HTTP simulado.
