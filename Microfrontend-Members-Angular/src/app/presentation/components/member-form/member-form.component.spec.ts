import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MemberFormComponent } from './member-form.component';
import type { NewMember } from '../../../domain/entities/member.entity';

describe('MemberFormComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [MemberFormComponent],
    });
  });

  it('debe crear el componente', () => {
    const component = TestBed.inject(MemberFormComponent);
    expect(component).toBeTruthy();
  });

  it('debe tener el formulario inválido inicialmente', () => {
    const component = TestBed.inject(MemberFormComponent);
    expect(component.form.invalid).toBe(true);
  });

  it('debe emitir submitted con datos válidos', () => {
    const component = TestBed.inject(MemberFormComponent);
    const spy = jest.spyOn(component.submitted, 'emit');

    component.form.setValue({
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '3001112233',
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith({
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '3001112233',
    });
  });

  it('no debe emitir submitted cuando el formulario es inválido', () => {
    const component = TestBed.inject(MemberFormComponent);
    const spy = jest.spyOn(component.submitted, 'emit');

    component.form.setValue({
      fullName: '',
      email: 'invalido',
      phone: '',
    });

    component.onSubmit();

    expect(spy).not.toHaveBeenCalled();
  });

  it('debe omitir phone vacío en el objeto enviado', () => {
    const component = TestBed.inject(MemberFormComponent);
    const spy = jest.spyOn(component.submitted, 'emit');

    component.form.setValue({
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '',
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith({
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '',
    });
  });

  it('debe incluir phone cuando tiene valor', () => {
    const component = TestBed.inject(MemberFormComponent);
    const spy = jest.spyOn(component.submitted, 'emit');

    component.form.setValue({
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '3001112233',
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith({
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '3001112233',
    });
  });

  it('debe emitir cancelled al cancelar', () => {
    const component = TestBed.inject(MemberFormComponent);
    const spy = jest.spyOn(component.cancelled, 'emit');

    component.onCancel();

    expect(spy).toHaveBeenCalledWith();
  });

  it('debe marcar email inválido con formato incorrecto', () => {
    const component = TestBed.inject(MemberFormComponent);
    component.email.setValue('no-es-un-email');

    expect(component.email.hasError('email')).toBe(true);
  });

  it('debe marcar email vacío como requerido', () => {
    const component = TestBed.inject(MemberFormComponent);
    component.email.setValue('');

    expect(component.email.hasError('required')).toBe(true);
  });

  it('debe marcar nombre vacío como requerido', () => {
    const component = TestBed.inject(MemberFormComponent);
    component.fullName.setValue('');

    expect(component.fullName.hasError('required')).toBe(true);
  });

  it('debe usar el fallback vacío cuando el valor del control es nulo', () => {
    const component = TestBed.inject(MemberFormComponent);
    const spy = jest.spyOn(component.submitted, 'emit');

    component.form.setValue({
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '3001112233',
    });
    jest.spyOn(component, 'fullName', 'get').mockReturnValue({ value: null } as never);
    jest.spyOn(component, 'email', 'get').mockReturnValue({ value: null } as never);

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith({
      fullName: '',
      email: '',
      phone: '3001112233',
    });
  });
});
