# Microfrontend de Préstamos — Parcial II Arquitectura de Software (UCEVA)

Microfrontend Angular del módulo **Préstamos** del sistema Biblioteca. Lista los préstamos, muestra el detalle de uno y permite registrar préstamos nuevos. Se expone con **Module Federation** y el host (`Client-Host-Angular`) lo carga en la ruta `/loans`.

| Dato | Valor |
| --- | --- |
| Puerto | **4203** |
| Remote (`name` en webpack) | `mf-loans` |
| Archivo de entrada | http://localhost:4203/remoteEntry.js |
| Módulo expuesto | `./LoansPage` → clase `LoansPage` (`src/app/presentation/pages/loans/loans.page.ts`) |
| Ruta en el host | http://localhost:4200/loans |
| Microservicio que consume | `Microservice-Loans-SpringBoot` en **http://localhost:3003/api** |

## Stack

- **Angular 20.3.14** (componentes standalone, SCSS, sin SSR, con Zone.js)
- **Module Federation** con `@angular-architects/module-federation` 20 y `ngx-build-plus`
- **Bootstrap 5.3.8**, **Bootstrap Icons** y el design system del curso **`@brejcha13320/design-system-bootstrap`** (`dsb-container-atom`, `dsb-badge-atom`, `dsb-button-atom`, `dsb-icon-atom`)
- **Jest 30** con `jest-preset-angular` para las pruebas
- **Compodoc** para la documentación del código

Las versiones de `package.json` son **idénticas** a las del host. Webpack comparte todas las librerías con `singleton: true` y `strictVersion: true`; si una versión no coincide, el host no puede cargar el remote.

## Endpoints que consume

| Caso de uso | Petición | Respuesta |
| --- | --- | --- |
| Listar préstamos | `GET http://localhost:3003/api/loans` | `200` arreglo de préstamos |
| Ver detalle | `GET http://localhost:3003/api/loans/{id}` | `200` préstamo / `404` |
| Registrar préstamo | `POST http://localhost:3003/api/loans` con `{ bookTitle, memberName, dueDate }` | `201` préstamo / `400` con `{ "message" }` |

Estas peticiones se ven en la pestaña **Network** del navegador al abrir http://localhost:4200/loans.

## Arquitectura — Clean Architecture

```
src/app/
├── domain/                               (núcleo: sin Angular ni HTTP)
│   ├── entities/
│   │   └── loan.entity.ts                (Loan, NewLoan y LoanStatus)
│   └── repositories/
│       └── loan.repository.ts            (clase ABSTRACTA = puerto: list, getById, create)
├── application/
│   └── usecases/                         (un solo método execute; solo dependen de LoanRepository)
│       ├── list-loans.usecase.ts         (ListLoansUseCase)
│       ├── get-loan-by-id.usecase.ts     (GetLoanByIdUseCase)
│       └── create-loan.usecase.ts        (CreateLoanUseCase)
├── infrastructure/                       (detalles: HTTP)
│   ├── config/
│   │   └── api.config.ts                 (URL base: http://localhost:3003/api)
│   ├── dtos/
│   │   └── loan.dto.ts                   (forma del JSON de la API)
│   ├── mappers/
│   │   └── loan.mapper.ts                (DTO ↔ entidad)
│   └── gateways/
│       └── loan-api.gateway.ts           (LoanApiGateway: extiende LoanRepository y usa HttpClient)
├── presentation/                         (Angular: página y componentes)
│   ├── pages/loans/
│   │   └── loans.page.ts / .html         (LoansPage: se expone por Module Federation)
│   ├── components/
│   │   ├── alert/                        (estados de carga y error)
│   │   ├── loans-table/                  (tabla con badge de estado y botón "Ver detalle")
│   │   ├── loan-detail/                  (tarjeta con el detalle del préstamo)
│   │   └── loan-form/                    (formulario reactivo para registrar)
│   └── interfaces/
│       └── state.interface.ts            (State: init | loading | success | error)
├── mocks/
│   └── loans.mocks.ts                    (datos para las pruebas)
├── app.ts  app.routes.ts  app.config.ts  (solo para la ejecución standalone)
```

| Capa | Puede importar | Responsabilidad |
| --- | --- | --- |
| `domain` | nada de Angular (solo el tipo `Observable` de rxjs) | Qué es un préstamo y qué operaciones existen |
| `application` | `domain` | Los 3 casos de uso del frontend, 1 a 1 con los endpoints |
| `infrastructure` | `domain`, `HttpClient` | Cómo se hablan esas operaciones con el microservicio |
| `presentation` | `application`, `domain` | Lo que ve el usuario; **nunca** importa `HttpClient` |

### Flujo de una petición

```
LoansPage ──► ListLoansUseCase.execute() ──► LoanRepository.list() ──► LoanApiGateway.list() ──► GET http://localhost:3003/api/loans
 (página)        (caso de uso)                  (puerto abstracto)        (adaptador HTTP)              (microservicio)
```

1. `LoansPage` llama a `listLoansUseCase.execute()` al iniciar. La página no sabe que existe HTTP.
2. El caso de uso pide los datos a `LoanRepository`, la clase abstracta del dominio.
3. Angular le entrega como `LoanRepository` una instancia de `LoanApiGateway` (ver la siguiente sección).
4. `LoanApiGateway` hace la petición con `HttpClient` y convierte cada `LoanDto` en `Loan` con `LoanMapper`.
5. La respuesta vuelve por la misma cadena y la página cambia `state` a `success` (o `error`) y muestra la tabla.

El detalle (`GetLoanByIdUseCase` → `GET /api/loans/{id}`) y el registro (`CreateLoanUseCase` → `POST /api/loans`) siguen el mismo camino.

### Por qué el enlace va en los `providers` de la página

```typescript
@Component({
  selector: 'app-loans',
  providers: [
    { provide: LoanRepository, useClass: LoanApiGateway },
    ListLoansUseCase, GetLoanByIdUseCase, CreateLoanUseCase,
  ],
  ...
})
export class LoansPage { ... }
```

Cuando el host carga este microfrontend, **solo descarga la clase `LoansPage`**. El `app.config.ts` del MF nunca se ejecuta, porque quien arrancó la aplicación fue el host con su propio `app.config.ts`. Si el enlace `LoanRepository → LoanApiGateway` estuviera en el `app.config.ts` del MF, dentro del host Angular no encontraría quién provee `LoanRepository` y la página fallaría con `NullInjectorError`.

Al declararlo en los `providers` de `LoansPage`, el enlace viaja con la página: donde se cree el componente (standalone o dentro del host), Angular crea ahí el gateway y los 3 casos de uso. `HttpClient` sí lo aporta quien arranca la aplicación: el host con `provideHttpClient()`, o el `app.config.ts` del MF en la ejecución standalone.

Tampoco se usa `providedIn: 'root'` en los casos de uso ni en el gateway, para que el dominio no quede atado a una implementación concreta.

## Casos de uso

| Caso de uso | Método | Qué hace |
| --- | --- | --- |
| `ListLoansUseCase` | `execute(): Observable<Loan[]>` | Obtiene todos los préstamos para la tabla. |
| `GetLoanByIdUseCase` | `execute(id): Observable<Loan>` | Obtiene un préstamo para mostrar su detalle. |
| `CreateLoanUseCase` | `execute(newLoan): Observable<Loan>` | Limpia espacios del libro y del socio y registra el préstamo. Las reglas de negocio las valida el microservicio. |

## Requisitos

- **Node.js** LTS y **npm**
- El microservicio `Microservice-Loans-SpringBoot` corriendo en el puerto 3003 para ver datos reales

## Instalar

```bash
cd Microfrontend-Loans-Angular
npm install
```

El archivo `.npmrc` trae `legacy-peer-deps=true`, igual que el host.

## Ejecutar

```bash
npm run start
```

- Standalone: http://localhost:4203
- Remote entry: http://localhost:4203/remoteEntry.js
- Dentro del host (con `Client-Host-Angular` en `npm run start`): http://localhost:4200/loans

Para ver datos, primero levanta el microservicio:

```bash
cd ../Microservice-Loans-SpringBoot
./gradlew bootRun
```

## Pruebas y cobertura

```bash
npm test                 # ejecuta las pruebas
npm run test:coverage    # pruebas con reporte de cobertura (mínimo 90 %)
```

`jest.config.js` exige **90 %** en statements, branches, functions y lines (`coverageThreshold`); si la cobertura baja, el comando falla. Actualmente son 60 pruebas con **100 %** en las cuatro métricas. El reporte HTML queda en `coverage/lcov-report/index.html`.

| Archivo de prueba | Qué valida |
| --- | --- |
| `*.usecase.spec.ts` | Cada caso de uso con un `LoanRepository` simulado |
| `loan.mapper.spec.ts` | La conversión DTO ↔ entidad |
| `loan-api.gateway.spec.ts` | Las peticiones GET, GET por id y POST con `HttpTestingController`, incluidos errores 404 y 500 |
| `loans.page.spec.ts` | Carga, error, detalle y registro con los casos de uso simulados, y el enlace real `LoanRepository → LoanApiGateway` |
| `*.component.spec.ts` y `app.spec.ts` | Alerta, tabla, detalle, formulario y componente raíz |

## Documentación (Compodoc)

```bash
npm run compodoc
```

Genera la documentación del código en `documentation/` a partir de los comentarios TSDoc de cada clase, propiedad y método. Abre `documentation/index.html` en el navegador. La carpeta está en `.gitignore` y no se sube al repositorio.
