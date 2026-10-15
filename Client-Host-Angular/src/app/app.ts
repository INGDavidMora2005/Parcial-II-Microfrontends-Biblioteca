import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarOrganism } from '@brejcha13320/design-system-bootstrap';

/**
 * Componente raíz de la aplicación Host.
 * Contiene el navbar del diseño y el router-outlet para los microfrontends.
 *
 * @remarks
 * Es un componente standalone que importa RouterOutlet y NavbarOrganism.
 * @see NavbarOrganism
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarOrganism],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /** Configuración del navbar que se pasa al organismo. */
  protected navbarConfig = {
    title: 'Biblioteca UCEVA',
    iconConfig: { icon: 'bootstrap', size: 2 },
    navLinks: [
      { text: 'Libros', url: '/books' },
      { text: 'Socios', url: '/members' },
      { text: 'Préstamos', url: '/loans' }
    ]
  };
}