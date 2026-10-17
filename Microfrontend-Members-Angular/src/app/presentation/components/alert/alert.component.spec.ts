import { TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AlertComponent],
    });
  });

  it('debe crear el componente', () => {
    const component = TestBed.inject(AlertComponent);
    expect(component).toBeTruthy();
  });

  it('debe tener message vacío por defecto', () => {
    const component = TestBed.inject(AlertComponent);
    expect(component.message).toBe('');
  });

  it('debe tener type error por defecto', () => {
    const component = TestBed.inject(AlertComponent);
    expect(component.type).toBe('error');
  });

  it('debe aceptar tipo success', () => {
    const component = TestBed.inject(AlertComponent);
    component.type = 'success';
    component.message = 'Operación exitosa';

    expect(component.type).toBe('success');
    expect(component.message).toBe('Operación exitosa');
  });

  it('debe aceptar tipo error', () => {
    const component = TestBed.inject(AlertComponent);
    component.type = 'error';
    component.message = 'Ocurrió un error';

    expect(component.type).toBe('error');
    expect(component.message).toBe('Ocurrió un error');
  });
});
