# Microfrontend de Socios — Parcial II Arquitectura de Software (UCEVA)

Microfrontend del módulo **Socios** del sistema Biblioteca, desarrollado con Angular 20.3.14, SCSS, sin SSR y Module Federation. Permite listar socios, ver el detalle de uno y registrar nuevos socios, consumiendo el microservicio de Socios (Spring Boot) en http://localhost:3002.

## Puertos y conexión

- **Puerto del microfrontend:** 4202 (`npm run start`)
- **Microservicio de Socios:** http://localhost:3002 (debe estar arrancado con `./gradlew bootRun` en `Microservice-Members-SpringBoot`)
- **Base URL de la API:** `http://localhost:3002/api/members` (configurada en `src/app/infrastructure/config/api.config.ts`)

Endpoints que consume:

| Método | Ruta completa | Caso de uso | Descripción |
|--------|--------------|-------------|-------------|
| GET | `/api/members` | `ListMembersUseCase` | Lista todos los socios |
| GET | `/api/members/{id}` | `GetMemberByIdUseCase` | Obtiene un socio por su id |
| POST | `/api/members` | `CreateMemberUseCase` | Registra un nuevo socio |

Todos los cuerpos de respuesta JSON usan camelCase: `id`, `fullName`, `email`, `phone`, `active`.

## Module Federation

- **Nombre:** `mf-members`
- **Archivo de entrada:** `http://localhost:4202/remoteEntry.js`
- **Módulo expuesto:** `./MembersPage` (clase `MembersPage` en `src/app/presentation/pages/members/members.page.ts`)
- **Configuración:** `webpack.config.js` con `withModuleFederationPlugin`, compartiendo librerías de Angular con `shareAll` (singleton, versión estricta)
- **Ruta en el host:** `/members` (el microfrontend Host-Angular carga este remoto bajo esa ruta)

## Arquitectura — Clean Architecture

El proyecto sigue Clean Architecture con dependencias que apuntan hacia adentro: las capas externas (presentation, infrastructure) dependen de las internas (application, domain), y ninguna capa interna depende de frameworks externos ni de capas externas.

Árbol real de `src/app`:

```
app/
├── app.ts                      (componente raíz, router-outlet)
├── app.html                    (template raíz)
├── app.routes.ts               (ruta '' -> MembersPage con loadComponent)
├── app.config.ts               (provideHttpClient)
├── application/
│   └── usecases/
│       ├── list-members.usecase.ts         (listar socios)
│       ├── get-member-by-id.usecase.ts     (obtener socio por id)
│       └── create-member.usecase.ts        (crear socio con validaciones)
├── domain/
│   ├── entities/
│   │   └── member.entity.ts      (interfaces Member y NewMember)
│   └── repositories/
│       └── member.repository.ts  (clase abstracta MemberRepository = puerto)
├── infrastructure/
│   ├── config/
│   │   └── api.config.ts         (MEMBERS_API_URL)
│   ├── dtos/
│   │   └── member.dto.ts         (MemberDto, CreateMemberDto)
│   ├── gateways/
│   │   └── member-api.gateway.ts (MemberApiGateway extends MemberRepository, HttpClient)
│   └── mappers/
│       └── member.mapper.ts      (toEntity, toCreateDto; normaliza phone null -> '')
└── presentation/
    ├── components/
    │   ├── alert/                (alerta error/success)
    │   ├── member-detail/        (tarjeta de detalle de socio)
    │   ├── member-form/          (formulario reactivo de creación)
    │   └── members-table/        (tabla de listado de socios)
    └── pages/
        └── members/
            └── members.page.ts   (página principal con providers y signals)
```

### Puerto vs implementación

`MemberRepository` es una **clase abstracta** (el puerto) definida en `domain/repositories/member.repository.ts`. Sirve como token de inyección y contrato que los casos de uso consumen. `MemberApiGateway` (`infrastructure/gateways/member-api.gateway.ts`) es la **implementación concreta** que extiende esa clase abstracta y llama al microservicio mediante `HttpClient`. El enlace entre ambos se hace en el `providers` del componente `MembersPage`.

### Regla de dependencias

- `domain` no importa nada (ni Angular, ni rxjs, ni nada de capas externas).
- `application` solo importa de `domain` y de `@angular/core` (únicamente `inject` e `Injectable`).
- `infrastructure` importa de `domain` y `application`, y usa `HttpClient` de `@angular/common/http`.
- `presentation` importa de `application`, `domain` y `infrastructure/gateways` (únicamente para el `providers`). No importa `HttpClient`.

## Inyección de dependencias

El enlace `MemberRepository -> MemberApiGateway` se declara en el `providers` del componente `MembersPage`, **no en `app.config.ts`**, porque al cargarse dentro del host mediante Module Federation, el `app.config.ts` del microfrontend no se ejecuta en el contexto del host. Declarar los proveedores en el componente asegura que cada vez que el host renderiza `MembersPage` se resuelva `MemberRepository` a `MemberApiGateway`. `provideHttpClient()` sí se registra en `app.config.ts` porque el host aporta el inyector de Angular que ya tiene configurado `HttpClient`.

## Flujo de un caso de uso (clic en "Guardar")

1. El usuario llena el formulario en `member-form.component.ts` y hace clic en "Guardar". El componente valida con `ReactiveFormsModule` y emite `submitted(NewMember)`.
2. `members.page.ts` recibe el evento en `createMember()`, pone `saving=true` y llama `createMemberUseCase.execute(member)`.
3. `create-member.usecase.ts` valida que `fullName` y `email` no estén vacíos y que el email contenga "@". Si pasa, llama `memberRepository.create(member)`.
4. La implementación concreta es `member-api.gateway.ts` (`MemberApiGateway extends MemberRepository`), que mapea con `member.mapper.ts` (`toCreateDto`) y llama `http.post(MEMBERS_API_URL, dto)` mediante `firstValueFrom`.
5. El microservicio en `http://localhost:3002/api/members` crea el socio, le asigna un id autoincremental y retorna el `MemberDto`.
6. `MemberApiGateway` mapea la respuesta con `toEntity()` y retorna el `Member`.
7. `members.page.ts` muestra el mensaje de éxito ("Socio creado correctamente"), cierra el formulario y recarga la lista con `listMembersUseCase.execute()`.

Todos los errores se capturan en `handleError()` del gateway y se muestran en el componente `alert`.

## Cómo ejecutar

Requisitos: Node.js y npm instalados.

Desde la carpeta `Microfrontend-Members-Angular`:

```
npm install
npm run start
```

El microfrontend sirve en **http://localhost:4202** y expone `remoteEntry.js` en `http://localhost:4202/remoteEntry.js`.

El microservicio de Socios debe estar corriendo en el puerto 3002 antes de usar el microfrontend:

```
cd ../Microservice-Members-SpringBoot
./gradlew bootRun
```

## Pruebas

```
npm test
npm run test:coverage
```

Herramienta: **Jest 30** con `jest-preset-angular`.

Cobertura obtenida (última ejecución):

| Métrica | Valor | Umbral |
|---------|-------|--------|
| Statements | 100% | 90% |
| Branches | 93.42% | 90% |
| Functions | 100% | 90% |
| Lines | 100% | 90% |

Exclusiones de cobertura (`jest.config.ts`, regla `collectCoverageFrom`):

- `src/main.ts`, `src/app/app.config.ts`, `src/app/app.routes.ts`, `src/app/app.ts`, `src/bootstrap.ts` — archivos de arranque y configuración de Angular (sin lógica de negocio).
- `src/**/*.config.ts`, `src/**/index.ts`, `src/**/*.module.ts` — archivos de configuración e índices de barrel.
- `src/app/domain/entities/member.entity.ts` — solo interfaces (sin código ejecutable).
- `src/app/infrastructure/dtos/member.dto.ts` — solo interfaces DTO (sin código ejecutable).

## Notas

El microservicio de Socios devuelve `phone: null` cuando no se envía un teléfono. El mapper (`member.mapper.ts`) normaliza ese valor a cadena vacía (`''`) tanto al convertir de DTO a entidad (`toEntity`) como de entidad a DTO (`toCreateDto`), para que la capa de presentación nunca reciba `null`.
