# Microservicio de Préstamos — Parcial II Arquitectura de Software (UCEVA)

Microservicio independiente del módulo **Préstamos** del sistema Biblioteca. Lo consume el microfrontend `Microfrontend-Loans-Angular` (puerto 4203), que a su vez se carga dentro del host en la ruta `/loans`.

Este microservicio **no consulta a Libros ni a Socios**: `bookTitle` y `memberName` son texto libre. Así cada vertical se puede desplegar, probar y cambiar sin depender de las otras.

| Dato | Valor |
| --- | --- |
| Puerto | **3003** |
| Prefijo de la API | `/api` (`server.servlet.context-path`) |
| Swagger UI | http://localhost:3003/api/docs |
| OpenAPI (JSON) | http://localhost:3003/api/api-docs |
| CORS | `http://localhost:4203` (MF de préstamos) y `http://localhost:4200` (host) |
| Datos | En memoria, 5 préstamos semilla al arrancar |

## Stack

- **Spring Boot 4.0.1** con `spring-boot-starter-webmvc`
- **Java 25** (toolchain de Gradle)
- **Gradle wrapper** (`gradlew`, `gradlew.bat`), Gradle 9.8.1
- **springdoc-openapi-starter-webmvc-ui 3.0.0** para Swagger
- **JUnit 5**, **Mockito** y **MockMvc** (incluidos en `spring-boot-starter-test`) para las pruebas

No usa Lombok, Bean Validation ni anotaciones `@Service`/`@Repository`/`@Component`. Se sigue el estilo del repositorio de clase `Uceva-SpringBoot-Taller-Clean-Architecture`.

## Arquitectura — Clean Architecture

Las dependencias apuntan **hacia adentro**: el dominio no conoce a nadie, los casos de uso solo conocen el dominio, y la infraestructura (Spring, HTTP, memoria) depende de las capas internas.

```
src/main/java/uceva/loans/
├── LoansApplication.java                  (arranque de Spring Boot)
├── domain/                                (núcleo: Java puro, sin Spring)
│   ├── entity/
│   │   ├── Loan.java                      (entidad: id, bookTitle, memberName, loanDate, dueDate, status)
│   │   └── LoanStatus.java                (ACTIVE | RETURNED)
│   ├── repository/
│   │   └── LoanRepository.java            (clase ABSTRACTA = puerto: getAll, getById, create)
│   └── exception/
│       ├── LoanNotFoundException.java     (→ 404)
│       └── InvalidLoanException.java      (→ 400)
├── application/
│   └── usecase/                           (reglas de la aplicación, sin anotaciones)
│       ├── ListLoansUseCase.java
│       ├── GetLoanByIdUseCase.java
│       └── CreateLoanUseCase.java
├── infrastructure/                        (detalles: web y datos)
│   ├── datasource/
│   │   └── LoanDatasource.java            (lista en memoria, 5 semillas, id autoincremental)
│   ├── repository/
│   │   └── LoanRepositoryImpl.java        (extiende LoanRepository y delega en LoanDatasource)
│   └── controller/
│       ├── LoanController.java            (@RestController /loans, solo invoca casos de uso)
│       ├── CreateLoanRequest.java         (cuerpo del POST)
│       └── GlobalExceptionHandler.java    (excepciones → { "message": "..." })
└── config/
    ├── AppConfig.java                     (@Bean: datasource, repositorio y casos de uso)
    ├── CorsConfig.java                    (orígenes 4203 y 4200)
    └── OpenApiConfig.java                 (información de la API en Swagger)
```

| Capa | Puede importar | Qué contiene |
| --- | --- | --- |
| `domain` | solo `java.*` | Entidad, estados, puerto del repositorio y excepciones |
| `application` | `domain` | Los 3 casos de uso, cada uno con un único método `execute` |
| `infrastructure` | `domain`, `application`, Spring | Datasource en memoria, implementación del repositorio, controlador REST y manejo de errores |
| `config` | todas | Composición de dependencias, CORS y Swagger |

### Por qué el repositorio es una clase abstracta

`LoanRepository` es el **puerto**: dice *qué* operaciones necesita la aplicación (`getAll`, `getById`, `create`) pero no *cómo* se hacen. Está en el dominio y es abstracto, así que no se puede instanciar ni sabe nada de listas, bases de datos o HTTP.

Los casos de uso reciben un `LoanRepository` en su constructor. Nunca ven `LoanRepositoryImpl`. Gracias a eso:

- Se pueden probar con un `mock(LoanRepository.class)`, sin levantar Spring ni datos.
- Si mañana los préstamos se guardan en una base de datos, solo se cambia la implementación (`LoanRepositoryImpl` / `LoanDatasource`). El dominio, los casos de uso y el controlador quedan igual.

Se usa `abstract class` (y no `interface`) para seguir el patrón del repositorio de clase (`ProductRepository`, `UserRepository`).

### Cómo AppConfig enlaza todo

Ninguna clase del dominio o de los casos de uso tiene anotaciones de Spring. Toda la conexión se hace en un solo lugar, `config/AppConfig.java`, con métodos `@Bean`:

```java
@Bean LoanDatasource loanDatasource()                                  → new LoanDatasource()
@Bean LoanRepository loanRepository(LoanDatasource ds)                 → new LoanRepositoryImpl(ds)
@Bean ListLoansUseCase listLoansUseCase(LoanRepository repo)           → new ListLoansUseCase(repo)
@Bean GetLoanByIdUseCase getLoanByIdUseCase(LoanRepository repo)       → new GetLoanByIdUseCase(repo)
@Bean CreateLoanUseCase createLoanUseCase(LoanRepository repo)         → new CreateLoanUseCase(repo)
```

El bean `loanRepository` se declara con el tipo abstracto `LoanRepository`, pero devuelve un `LoanRepositoryImpl`. Ese es el enlace **puerto → implementación**. Spring inyecta los casos de uso en el constructor de `LoanController`, que solo llama a `execute(...)`.

### Recorrido de un `POST /api/loans`

1. `LoanController.create()` recibe el JSON como `CreateLoanRequest` y llama a `createLoanUseCase.execute(bookTitle, memberName, dueDate)`.
2. `CreateLoanUseCase` valida que los tres campos vengan, que `dueDate` tenga formato `YYYY-MM-DD` y que no sea anterior a hoy. Si algo falla, lanza `InvalidLoanException`.
3. Si es válido, crea el `Loan` con `loanDate` = hoy y `status` = `ACTIVE`, y llama a `loanRepository.create(loan)` (el puerto).
4. `LoanRepositoryImpl` delega en `LoanDatasource`, que asigna el siguiente `id` y lo guarda en memoria.
5. El controlador responde `201` con el préstamo. Si hubo una excepción, `GlobalExceptionHandler` responde `400` o `404` con `{ "message": "..." }`.

## Casos de uso

| Caso de uso | Método | Qué hace |
| --- | --- | --- |
| `ListLoansUseCase` | `execute()` | Devuelve todos los préstamos. |
| `GetLoanByIdUseCase` | `execute(Integer id)` | Devuelve el préstamo o lanza `LoanNotFoundException` (404). |
| `CreateLoanUseCase` | `execute(String bookTitle, String memberName, String dueDate)` | Valida los datos, asigna `loanDate` = hoy y `status` = `ACTIVE`, y lo registra. Lanza `InvalidLoanException` (400) si los datos no son válidos. |

## Endpoints

Modelo `Loan` (fechas en formato ISO `YYYY-MM-DD`):

```json
{
  "id": 1,
  "bookTitle": "Cien años de soledad",
  "memberName": "David Mora Duque",
  "loanDate": "2026-09-20",
  "dueDate": "2026-10-04",
  "status": "RETURNED"
}
```

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/api/loans` | `200` arreglo de `Loan` |
| GET | `/api/loans/{id}` | `200` `Loan` / `404` |
| POST | `/api/loans` | `201` `Loan` / `400` |

Todos los errores responden con el cuerpo `{ "message": "texto del error" }`.

### GET /api/loans

```bash
curl http://localhost:3003/api/loans
```

```json
[
  { "id": 1, "bookTitle": "Cien años de soledad", "memberName": "David Mora Duque", "loanDate": "2026-09-20", "dueDate": "2026-10-04", "status": "RETURNED" },
  { "id": 2, "bookTitle": "El amor en los tiempos del cólera", "memberName": "Juan Diego Rodriguez", "loanDate": "2026-10-01", "dueDate": "2026-10-15", "status": "ACTIVE" },
  { "id": 3, "bookTitle": "Don Quijote de la Mancha", "memberName": "Juan Pablo Devia", "loanDate": "2026-10-05", "dueDate": "2026-10-19", "status": "ACTIVE" },
  { "id": 4, "bookTitle": "La María", "memberName": "Maria Fernanda Lopez", "loanDate": "2026-09-28", "dueDate": "2026-10-12", "status": "RETURNED" },
  { "id": 5, "bookTitle": "Rayuela", "memberName": "Carlos Alberto Ruiz", "loanDate": "2026-10-10", "dueDate": "2026-10-24", "status": "ACTIVE" }
]
```

### GET /api/loans/{id}

```bash
curl http://localhost:3003/api/loans/1
```

```json
{ "id": 1, "bookTitle": "Cien años de soledad", "memberName": "David Mora Duque", "loanDate": "2026-09-20", "dueDate": "2026-10-04", "status": "RETURNED" }
```

Si el préstamo no existe (`/api/loans/999`) responde `404`:

```json
{ "message": "No existe un préstamo con id 999" }
```

### POST /api/loans

`bookTitle`, `memberName` y `dueDate` son obligatorios. `loanDate` es la fecha de hoy y `status` es `ACTIVE`.

```bash
curl -X POST http://localhost:3003/api/loans \
  -H "Content-Type: application/json" \
  -d '{"bookTitle":"Rayuela","memberName":"Juan Pablo Devia","dueDate":"2026-11-15"}'
```

Respuesta `201`:

```json
{ "id": 6, "bookTitle": "Rayuela", "memberName": "Juan Pablo Devia", "loanDate": "2026-10-16", "dueDate": "2026-11-15", "status": "ACTIVE" }
```

Respuestas `400`:

| Caso | `message` |
| --- | --- |
| Falta `bookTitle` | `El título del libro es obligatorio` |
| Falta `memberName` | `El nombre del socio es obligatorio` |
| Falta `dueDate` | `La fecha de devolución es obligatoria` |
| `dueDate` = `"15-11-2026"` | `La fecha de devolución debe tener el formato YYYY-MM-DD` |
| `dueDate` anterior a hoy | `La fecha de devolución no puede ser anterior a hoy` |
| JSON mal formado | `El cuerpo de la petición no es un JSON válido` |
| `GET /api/loans/abc` | `El id debe ser un número` |

## Swagger

Con el microservicio en marcha, abre http://localhost:3003/api/docs. Redirige a la interfaz de Swagger UI, donde aparecen los 3 endpoints con sus respuestas y se pueden probar desde el navegador.

## Requisitos

- **JDK 25**. En macOS con Homebrew:
  ```bash
  brew install openjdk@25
  sudo ln -sfn /opt/homebrew/opt/openjdk@25/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-25.jdk
  ```
- No hace falta instalar Gradle: el wrapper (`./gradlew`) lo descarga la primera vez.

## Ejecutar

```bash
cd Microservice-Loans-SpringBoot
./gradlew bootRun
```

El microservicio queda en http://localhost:3003/api/loans. En Windows se usa `gradlew.bat bootRun`.

## Probar

```bash
./gradlew test
```

Son 25 pruebas con JUnit 5, Mockito y MockMvc:

| Clase de prueba | Qué valida |
| --- | --- |
| `ListLoansUseCaseTest`, `GetLoanByIdUseCaseTest`, `CreateLoanUseCaseTest` | Los casos de uso con un repositorio simulado, incluidas todas las validaciones del POST |
| `LoanDatasourceTest` | Los 5 préstamos semilla, la búsqueda por id y el id autoincremental |
| `LoanRepositoryImplTest` | Que el repositorio delega correctamente en el datasource |
| `LoanControllerTest` | Los 3 endpoints con MockMvc: códigos 200, 201, 400 y 404 y el cuerpo `{ "message" }` |
| `LoansApplicationTests` | Que el contexto de Spring arranca y `AppConfig` enlaza todo |

El reporte HTML queda en `build/reports/tests/test/index.html`.
