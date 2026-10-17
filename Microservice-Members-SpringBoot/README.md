# Microservicio de Socios — Parcial II Arquitectura de Software (UCEVA)

Microservicio independiente del módulo **Socios** del sistema Biblioteca. Es uno de los tres microservicios del sistema (Libros, Socios, Préstamos), cada uno con su propio microfrontend. Este microservicio **no consulta a ninguno de los otros dos**: todos los datos son texto libre y se manejan de forma independiente.

## Stack

- **Spring Boot 4.0.1** (Java 25, toolchain de Gradle)
- **Gradle wrapper** (`gradlew`, `gradlew.bat`)
- **springdoc-openapi-starter-webmvc-ui 3.0.0** (Swagger/OpenAPI en `/api/docs`)
- **JUnit 5** y **Mockito** para pruebas unitarias
- **Jakarta Bean Validation** (`jakarta.validation`) para validación de entrada
- **Jackson** para serialización JSON

## Arquitectura — Clean Architecture

El proyecto sigue Clean Architecture con dependencias que apuntan hacia adentro (el núcleo no depende de frameworks ni de capas externas).

Árbol real de carpetas (`src/main/java/uceva/members/`):

```
uceva/members/
├── MembersApplication.java              (clase principal @SpringBootApplication)
├── config/
│   ├── AppConfig.java                   (composition root: @Bean de datasource, repositorio y casos de uso)
│   ├── CorsConfig.java                  (CORS para localhost:4200 y localhost:4202)
│   └── OpenApiConfig.java               (bean OpenAPI con título "API de Socios")
├── domain/
│   ├── entity/
│   │   └── Member.java                  (entidad pura, POJO sin anotaciones de framework)
│   ├── exception/
│   │   ├── MemberNotFoundException.java
│   │   └── InvalidMemberException.java  (excepciones puras de dominio, RuntimeException)
│   └── repository/
│       └── MemberRepository.java        (INTERFAZ = puerto: findAll, findById, save)
├── application/
│   └── usecase/
│       ├── ListMembersUseCase.java      (caso de uso: listar socios)
│       ├── GetMemberByIdUseCase.java    (caso de uso: obtener socio por id)
│       └── CreateMemberUseCase.java     (caso de uso: registrar socio)
└── infrastructure/
    ├── controller/
    │   ├── MemberController.java        (@RestController, solo invoca casos de uso)
    │   ├── CreateMemberRequest.java     (DTO de entrada con @Valid)
    │   └── GlobalExceptionHandler.java  (@RestControllerAdvice, mapea excepciones a HTTP)
    ├── datasource/
    │   └── MemberDatasource.java        (almacenamiento en memoria, 5 socios semilla, id autoincremental)
    └── repository/
        └── MemberRepositoryImpl.java    (implementación de MemberRepository, delega en MemberDatasource)
```

### Regla de dependencias hacia adentro

- **`domain`** no importa nada de `application`, `infrastructure`, `config` ni de ningún framework (Spring, Swagger, Jakarta). Solo importa de `java.util` y `java.util.concurrent`.
- **`application`** (casos de uso) solo importa de `uceva.members.domain` y de `java.*`. Depende de la **interfaz** `MemberRepository`, nunca de su implementación `MemberRepositoryImpl`.
- **`infrastructure`** y **`config`** dependen de `domain` y `application`, e implementan las interfaces del dominio. Aquí es donde viven Spring (`@RestController`, `@RestControllerAdvice`, `@Configuration`, `@Bean`) y Swagger (`@Tag`, `@Operation`, `@ApiResponse`).

### Enlace interfaz → implementación

En `config/AppConfig.java` se declaran todos los beans con `@Bean`:
- `memberDatasource()` → `new MemberDatasource()`
- `memberRepository(MemberDatasource)` → `new MemberRepositoryImpl(datasource)`
- `listMembersUseCase(MemberRepositoryImpl)` → `new ListMembersUseCase(memberRepository)`
- `getMemberByIdUseCase(MemberRepositoryImpl)` → `new GetMemberByIdUseCase(memberRepository)`
- `createMemberUseCase(MemberRepositoryImpl)` → `new CreateMemberUseCase(memberRepository)`

Los casos de uso **no llevan anotaciones de Spring** (`@Service`, `@Component`, etc.) porque pertenecen a la capa de aplicación, que no debe depender de frameworks. El enlace concreto (qué implementación de `MemberRepository` usar) se resuelve en `AppConfig`, la capa de configuración externa.

## Casos de uso

| Caso de uso | Responsabilidad | Validaciones |
|-------------|-----------------|--------------|
| `ListMembersUseCase.execute()` | Retorna `List<Member>` con todos los socios | Ninguna |
| `GetMemberByIdUseCase.execute(Long id)` | Retorna el `Member` con el id dado | Lanza `MemberNotFoundException` si no existe |
| `CreateMemberUseCase.execute(fullName, email, phone)` | Crea un `Member` con `active=true`, lo guarda y lo devuelve | `fullName` y `email` obligatorios (no nulos ni vacíos), lanza `InvalidMemberException` si faltan |

## Endpoints

Base URL: `http://localhost:3002/api` (context-path `/api`, puerto `3002`)

| Método | Ruta completa | Caso de uso | Códigos | Ejemplo de petición | Ejemplo de respuesta |
|--------|--------------|-------------|---------|---------------------|----------------------|
| GET | `/api/members` | `ListMembersUseCase` | 200 | — | `[{"id":1,"fullName":"David Mora Duque","email":"david.mora@uceva.edu.co","phone":"3001234567","active":true}]` |
| GET | `/api/members/{id}` | `GetMemberByIdUseCase` | 200 / 404 | — | `{"id":1,"fullName":"David Mora Duque","email":"david.mora@uceva.edu.co","phone":"3001234567","active":true}` |
| POST | `/api/members` | `CreateMemberUseCase` | 201 / 400 | `{"fullName":"Juan Perez","email":"juan@email.com","phone":"3001112233"}` | `{"id":6,"fullName":"Juan Perez","email":"juan@email.com","phone":"3001112233","active":true}` |

### Formato de error

Todos los errores retornan cuerpo JSON con la clave `message`:

```json
{ "message": "Socio no encontrado con id: 999" }
```

- `MemberNotFoundException` → **404** con `{"message": "..."}`
- `InvalidMemberException` → **400** con `{"message": "..."}`
- Datos de petición malformados (`@Valid` falla) → **400** con `{"message": "..."}` (primer error de campo)

## Modelo Member

Campo | Tipo | Descripción
------|------|-------------
`id` | `Long` | Identificador numérico autoincremental
`fullName` | `String` | Nombre completo del socio
`email` | `String` | Correo electrónico del socio
`phone` | `String` | Teléfono del socio
`active` | `boolean` | Estado del socio (arranca en `true` al crearse)

JSON de salida (camelCase): `id`, `fullName`, `email`, `phone`, `active`.

## CORS

Habilitado únicamente para los orígenes:
- `http://localhost:4200` (host Angular)
- `http://localhost:4202` (Microfrontend-Members-Angular)

Métodos permitidos: `GET`, `POST`, `OPTIONS`. Configurado en `config/CorsConfig.java`.

## Cómo ejecutar

Desde la carpeta `Microservice-Members-SpringBoot`:

**Windows:**
```
.\gradlew.bat bootRun
```

**Linux / Mac:**
```
./gradlew bootRun
```

El servicio arranca en **puerto 3002** con context-path `/api`.

Swagger UI: `http://localhost:3002/api/docs`
OpenAPI JSON: `http://localhost:3002/api/api-docs`

## Cómo probar

Desde la carpeta `Microservice-Members-SpringBoot`:

```
.\gradlew.bat test
```

Ejecuta todas las pruebas unitarias (casos de uso, datasource, repositorio, controlador con MockMvc).

## Quién lo consume

**Microfrontend-Members-Angular** (puerto 4202), expuesto por Module Federation como `./MembersPage` (clase `MembersPage`). La relación MF → MS es: `Microfrontend-Members-Angular` (4202) → `Microservice-Members-SpringBoot` (3002).

## Datos semilla

Al arrancar se cargan 5 socios en memoria:
1. David Mora Duque — david.mora@uceva.edu.co — 3001234567
2. Juan Diego Rodriguez — juand.rodriguez@uceva.edu.co — 3002345678
3. Juan Pablo Devia — juanp.devia@uceva.edu.co — 3003456789
4. Maria Fernanda Lopez — maria.lopez@uceva.edu.co — 3004567890
5. Carlos Alberto Ruiz — carlos.ruiz@uceva.edu.co — 3005678901

Todos con `active = true`. Los ids se asignan automáticamente con `AtomicLong` (autoincremental).
