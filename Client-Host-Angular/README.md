# Client-Host-Angular (Host de la Biblioteca)

Este proyecto actúa como el **Host** en la arquitectura de microfrontends del sistema de Biblioteca para el Parcial II de Arquitectura de Software (UCEVA). Es el punto de entrada único para el usuario, encargado de orquestar la carga de los microfrontends especializados.

## 🚀 Detalles Técnicos
- **Puerto**: 4200
- **Framework**: Angular 20.3.14
- **Orquestación**: Module Federation (Clásico) mediante `ngx-build-plus`
- **Estilos**: SCSS + Bootstrap 5.3.8 + Design System Bootstrap

## 🌐 Microfrontends (Remotes)

| Nombre | Puerto | Módulo Expuesto | Ruta en Host |
| :--- | :--- | :--- | :--- |
| MF Libros | 4201 | `./BooksPage` | `/books` |
| MF Socios | 4202 | `./MembersPage` | `/members` |
| MF Préstamos | 4203 | `./LoansPage` | `/loans` |

## 🛠️ Instalación y Ejecución

### Requisitos
- Node.js (v20+ recomendado)
- npm

### Pasos
1. **Instalar dependencias**:
   ```bash
   npm install
   ```
   *Nota: Se utiliza `--legacy-peer-deps` (configurado en `.npmrc`) para resolver conflictos de versiones estrictas de Angular requeridos por el sistema de federación.*

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm run start
   ```
   La aplicación estará disponible en `http://localhost:4200`.

3. **Ejecutar pruebas**:
   ```bash
   npm test
   ```
   Para generar el reporte de cobertura:
   ```bash
   npm run test:coverage
   ```

4. **Generar documentación (Compodoc)**:
   ```bash
   npm run compodoc
   ```

## ⚙️ Funcionamiento de Module Federation

Este Host implementa el patrón de **Federación de Módulos** para cargar componentes de forma dinámica en tiempo de ejecución:

1. **`remoteEntry.js`**: El Host consume este archivo manifest de cada remote para conocer los módulos disponibles.
2. **`loadRemoteModule`**: Se utiliza en las rutas (`app.routes.ts`) para importar el componente remoto solo cuando el usuario navega a la ruta correspondiente.
3. **`shareAll`**: En `webpack.config.js`, se configuran las dependencias compartidas (como `@angular/core`) como **singletons** con versiones estrictas. Esto evita que el navegador cargue múltiples instancias del framework, reduciendo el tamaño del bundle y evitando errores de inyección de dependencias.
