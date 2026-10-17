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

Los **casos de uso son clases planas sin imports de Angular**: `domain` y `application` no importan `@angular`. Las tres clases (`ListMembersUseCase`, `GetMemberByIdUseCase`, `CreateMemberUseCase`) reciben `MemberRepository` por constructor y exponen `execute()`. Se instancian mediante `useFactory` en `members.providers.ts`.

Árbol real de `src/app`:

```
app/
├── app.ts                      (componente raíz standalone, router-outlet)
├── app.html                    (template raíz)
├── app.scss                    (estilos del componente raíz)
├── app.routes.ts               (ruta '' -> MembersPage con loadComponent)
├── app.config.ts               (provideHttpClient, provideRouter, etc.)
├── application/
│   └── usecases/
│       ├── list-members.usecase.ts         (ListMembersUseCase.execute -> findAll)
│       ├── get-member-by-id.usecase.ts     (GetMemberByIdUseCase.execute: valida id, luego findById)
│       └── create-member.usecase.ts        (CreateMemberUseCase.execute: valida, luego create)
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
│       └── member.mapper.ts      (MemberMapper.toEntity / toCreateDto; normaliza phone null -> '')
└── presentation/
    ├── components/
    │   ├── alert/                (alerta error/success)
    │   ├── member-detail/        (tarjeta de detalle de socio)
    │   ├── member-form/          (formulario reactivo de creación)
    │   └── members-table/        (tabla de listado de socios)
    └── pages/
        └── members/
            ├── members.page.ts        (MembersPage: signals, usa providers: MEMBERS_PROVIDERS)
            └── members.providers.ts   (MEMBERS_PROVIDERS: raíz de composición)
```

### Puerto vs implementación

`MemberRepository` es una **clase abstracta** (el puerto) definida en `domain/repositories/member.repository.ts`. Declara tres métodos:

- `findAll(): Promise<Member[]>` — obtiene todos los socios.
- `findById(id: number): Promise<Member>` — obtiene un socio por su id.
- `create(member: NewMember): Promise<Member>` — registra un socio nuevo.

Sirve como token de inyección y contrato que los casos de uso consumen. `MemberApiGateway` (`infrastructure/gateways/member-api.gateway.ts`) es la **implementación concreta**: implementa el puerto (`class MemberApiGateway implements MemberRepository`) e implementa los tres métodos con `HttpClient`. El enlace entre ambos se hace en `MEMBERS_PROVIDERS`.

### Regla de dependencias

- `domain` no importa frameworks ni capas externas (solo sus propios tipos).
- `application` importa únicamente de `domain`; **no importa `@angular`** (los casos de uso son clases planas).
- `infrastructure` importa de `domain` y `application`, y usa `HttpClient`/`HttpErrorResponse` de `@angular/common/http`.
- `presentation` importa de `application`, `domain` e `infrastructure/gateways` (solo desde `members.providers.ts`) y usa APIs de `@angular/core` en los componentes. No importa `HttpClient`.

## Inyección de dependencias

La composición está en `presentation/pages/members/members.providers.ts`, que exporta `MEMBERS_PROVIDERS: Provider[]`:

- `{ provide: MemberRepository, useClass: MemberApiGateway }` — enlaza el puerto con su implementación.
- `ListMembersUseCase`, `GetMemberByIdUseCase` y `CreateMemberUseCase` se declaran con `useFactory`, construyendo cada caso de uso con `new ...(repository)` y `deps: [MemberRepository]`.

`MembersPage` declara `providers: MEMBERS_PROVIDERS` en su decorador `@Component` y resuelve los tres casos de uso con `inject()`.

El enlace **no se declara en `app.config.ts`** porque, al cargarse dentro del host mediante Module Federation, el `app.config.ts` del microfrontend no se ejecuta en el contexto del host. Declarar los proveedores en el componente asegura que cada vez que el host renderiza `MembersPage` se resuelvan `MemberRepository -> MemberApiGateway` y los casos de uso. `provideHttpClient()` sí se registra en `app.config.ts` porque el host aporta el inyector de Angular que ya tiene configurado `HttpClient`.

## Flujo de un caso de uso (clic en "Guardar")

1. El usuario llena el formulario en `member-form.component.ts` y hace clic en "Guardar". El componente valida con `ReactiveFormsModule` y emite `submitted(NewMember)`.
2. `members.page.ts` recibe el evento en `createMember()`, limpia el error, pone `saving=true` y llama `createMemberService.execute(member)`.
3. `create-member.usecase.ts` valida que `fullName` no esté vacío, que `email` no esté vacío y que contenga "@". Si falla, lanza `Error` con el mensaje correspondiente; si pasa, llama `memberRepository.create(member)`.
4. La implementación concreta es `member-api.gateway.ts` (`MemberApiGateway`), que mapea con `member.mapper.ts` (`MemberMapper.toCreateDto`) y llama `http.post(MEMBERS_API_URL, dto)` mediante `firstValueFrom`.
5. El microservicio en `http://localhost:3002/api/members` crea el socio, le asigna un id autoincremental y retorna el `MemberDto`.
6. `MemberApiGateway` mapea la respuesta con `MemberMapper.toEntity()` y retorna el `Member`.
7. `members.page.ts` muestra el mensaje de éxito (`Socio "<fullName>" registrado correctamente.`), cierra el formulario, limpia la selección y recarga la lista con `loadMembers()` (que usa `ListMembersUseCase.execute()`).

Manejo de errores: `MemberApiGateway.request()` captura el error y lanza `new Error(extractMessage(error))`. `extractMessage()` decide el mensaje: si el error es `HttpErrorResponse` usa `error.error.message` cuando existe; si el estado es `0` responde "No se pudo conectar con el servicio de socios"; si es `404` sin mensaje responde "Socio no encontrado"; en otro caso "El servicio de socios respondió con el error <status>". Si no es `HttpErrorResponse`, responde "Ocurrió un error inesperado". La página muestra ese mensaje en el componente `alert`; cuando el error no es una instancia de `Error`, usa los mensajes por defecto ("Error al cargar los socios", "Error al obtener el socio", "Error al crear el socio").

## Estilos

Los estilos están **centralizados en `src/styles.scss`** (registrado como hoja global en `angular.json`). **No se usa Bootstrap** y **no hay Tailwind instalado**: `styles.scss` define de forma explícita la capa de utilidades usada en las plantillas `.html` (layout, tipografía, colores, bordes, estados `:hover/:focus/:disabled`) más los componentes con acabado del taller (`.card-container`, `.members-table`, `.badge`, `.btn-primary`, `.btn-link`). No se crean archivos `.scss` por componente; la única excepción es `app.scss`, asociado al componente raíz `App`.

## Cómo ejecutar

Requisitos: Node.js y npm instalados.

Desde la carpeta `Microfrontend-Members-Angular`:

```
npm install
npm run start
npm run compodoc  # genera la documentación técnica en ./documentation
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

Herramienta: **Jest 30** con `jest-preset-angular`, `testEnvironment: 'jsdom'` y `setupFilesAfterEnv: ['<rootDir>/setup-jest.ts']`, configurado en `jest.config.js`.

Resultado real de la última ejecución de `npm run test:coverage`:

- **Suites:** 10 aprobadas, 10 en total.
- **Tests:** 65 aprobados, 65 en total.

| Métrica | Valor | Umbral global |
|---------|-------|---------------|
| Statements | 100% | 90% |
| Branches | 100% | 90% |
| Functions | 100% | 90% |
| Lines | 100% | 90% |

El umbral global (90% en las cuatro métricas) se define en `coverageThreshold` de `jest.config.js`, y los reportes se generan con `coverageReporters: ['text', 'lcov']`.

Exclusiones reales de cobertura (`jest.config.js`, regla `collectCoverageFrom`), partiendo de `'src/app/**/*.ts'`:

- `!src/app/**/*.spec.ts` — archivos de prueba.
- `!src/app/app.ts` — componente raíz.
- `!src/app/app.config.ts` — configuración de providers de Angular.
- `!src/app/app.routes.ts` — definición de rutas.

## Notas

El microservicio de Socios devuelve `phone: null` cuando no se envía un teléfono. El mapper (`member.mapper.ts`) normaliza ese valor a cadena vacía (`''`) tanto al convertir de DTO a entidad (`toEntity`) como de entidad a DTO (`toCreateDto`), para que la capa de presentación nunca reciba `null`.
