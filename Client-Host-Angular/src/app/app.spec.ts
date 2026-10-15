import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { App } from './app';

describe('App Component', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should expose navbarConfig with three links and correct URLs', () => {
    // Access navbarConfig from component
    const config = (component as any).navbarConfig;
    expect(config).toBeDefined();
    expect(config.title).toBe('Biblioteca UCEVA');
    expect(config.iconConfig).toEqual({ icon: 'bootstrap', size: 2 });
    expect(config.navLinks.length).toBe(3);

    expect(config.navLinks[0]).toEqual({ text: 'Libros', url: '/books' });
    expect(config.navLinks[1]).toEqual({ text: 'Socios', url: '/members' });
    expect(config.navLinks[2]).toEqual({ text: 'Préstamos', url: '/loans' });
  });

  it('should render navbar-organism and router-outlet in template', () => {
    fixture.detectChanges();
    const navbar = fixture.debugElement.query(By.css('dsb-navbar-organism'));
    expect(navbar).toBeTruthy();

    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });
});
