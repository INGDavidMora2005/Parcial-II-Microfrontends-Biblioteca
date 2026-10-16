# Microservicio de Libros (Node.js)

Microservicio RESTful para la gestión del catálogo de libros en el sistema de Biblioteca. Implementado con **Clean Architecture** (Arquitectura Limpia) en TypeScript y Express 5.

## 📌 Especificaciones
- **Puerto**: 3001
- **Consumidores**:
  - Microfrontend de Libros (`http://localhost:4201`)
  - Host Angular (`http://localhost:4200`)
- **Documentación Swagger**: `http://localhost:3001/api/docs/`
- **CORS Habilitado**: `http://localhost:4201`, `http://localhost:4200`

---

## 🏛️ Clean Architecture (Capas del Sistema)

Las dependencias fluyen estrictamente **hacia adentro**:

```text
[HTTP (Express/Swagger)] ---> [Application (Casos de Uso)] ---> [Domain (Entidades/Contratos)]
                                         ^
                                         |
[Infrastructure (Datasources/Repos)] ----+
```

### Contenido de cada carpeta:
- **`src/domain/`**: Núcleo puro de la aplicación, sin dependencias externas.
  - `entities/`: Modelos y tipos de datos de negocio (`Book`, `NewBook`).
  - `repositories/`: Interfaces y contratos abstractos de acceso a datos (`BookRepository`).
  - `errors/`: Clases de error de dominio (`CustomError`) y función de normalización (`handleError`).
- **`src/application/`**: Reglas de negocio de la aplicación.
  - `usecases/`: Casos de uso aislados (`ListBooksUseCase`, `GetBookByIdUseCase`, `CreateBookUseCase`).
- **`src/infrastructure/`**: Implementaciones técnicas y adaptadores externos.
  - `datasources/`: Almacén de datos en memoria (`BookMemoryDatasource`) con 5 libros semilla.
  - `repositories/`: Implementación del contrato de repositorio (`BookRepositoryImpl`).
  - `http/`: Controlador (`BookController`), rutas (`BookRoutes`, `AppRoutes`) y servidor (`Server`).
- **`src/config/`**: Adaptadores de configuración del sistema (`envs.ts`, `swagger.ts`, `swagger.schemas.ts`).
- **`src/app.ts`**: **Composition Root**, el único punto donde se orquestan e inyectan todas las dependencias.

---

## 🔄 Recorrido de un Caso de Uso (Flujo de Ejecución)

Por ejemplo, al crear un libro (`POST /api/books`):
1. **Petición HTTP**: El cliente envía la petición con JSON a Express (`Server`).
2. **Ruta**: `AppRoutes` deriva a `BookRoutes` que coincide con el método POST.
3. **Controlador**: `BookController.create` recibe el payload y delega la ejecución a `CreateBookUseCase`.
4. **Caso de Uso**: `CreateBookUseCase.execute` valida los datos (título, autor, isbn no vacíos, año > 0), asigna `available: true` y llama a `BookRepository.create`.
5. **Repositorio (Impl)**: `BookRepositoryImpl.create` delega la persistencia al `BookMemoryDatasource`.
6. **Datasource**: Asigna el ID autoincremental y almacena el libro en el arreglo en memoria.
7. **Retorno**: El objeto `Book` creado regresa a través de las capas hasta el controlador, que responde con HTTP 201 y el JSON generado.

---

## 📖 Endpoints de la API

| Método | Endpoint | Descripción | Códigos de Respuesta |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Listar todos los libros | `200 OK` |
| `GET` | `/api/books/:id` | Obtener un libro por ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/api/books` | Registrar un nuevo libro | `201 Created`, `400 Bad Request` |
| `GET` | `/api/docs/` | Documentación interactiva Swagger | `200 OK` |

### Formato de Errores
Todos los errores responden con un cuerpo estandarizado:
```json
{
  "message": "Descripción clara del error"
}
```

### Ejemplos de Petición y Respuesta

#### 1. Obtener todos los libros
```bash
GET /api/books
```
**Respuesta (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "isbn": "978-0132350884",
    "year": 2008,
    "available": true
  }
]
```

#### 2. Crear un libro
```bash
POST /api/books
Content-Type: application/json

{
  "title": "The Pragmatic Programmer",
  "author": "Andy Hunt, Dave Thomas",
  "isbn": "978-0201616224",
  "year": 1999
}
```
**Respuesta (201 Created):**
```json
{
  "id": 6,
  "title": "The Pragmatic Programmer",
  "author": "Andy Hunt, Dave Thomas",
  "isbn": "978-0201616224",
  "year": 1999,
  "available": true
}
```

---

## 🚀 Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo con recarga en caliente
npm run start
```
