import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NEW_LOAN_MOCK } from '../../../mocks/loans.mocks';
import { LoanFormComponent } from './loan-form.component';

describe('LoanFormComponent', () => {
  let component: LoanFormComponent;
  let fixture: ComponentFixture<LoanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con el formulario vacío e inválido', () => {
    expect(component.form.getRawValue()).toEqual({ bookTitle: '', memberName: '', dueDate: '' });
    expect(component.form.invalid).toBe(true);
  });

  it('no debería marcar campos inválidos antes de que el usuario los toque', () => {
    expect(component.isInvalid('bookTitle')).toBe(false);
  });

  it('debería marcar los campos obligatorios y no emitir si el formulario es inválido', () => {
    const spySubmit = jest.spyOn(component.submitLoan, 'emit');

    fixture.debugElement.query(By.css('#loan-form-submit')).nativeElement.click();
    fixture.detectChanges();

    expect(spySubmit).not.toHaveBeenCalled();
    expect(component.isInvalid('bookTitle')).toBe(true);
    expect(component.isInvalid('memberName')).toBe(true);
    expect(component.isInvalid('dueDate')).toBe(true);
    expect(fixture.debugElement.queryAll(By.css('.is-invalid')).length).toBe(3);
  });

  it('debería emitir los datos del préstamo cuando el formulario es válido', () => {
    const spySubmit = jest.spyOn(component.submitLoan, 'emit');
    component.form.setValue(NEW_LOAN_MOCK);

    component.onSubmit();

    expect(spySubmit).toHaveBeenCalledWith(NEW_LOAN_MOCK);
  });

  it('no debería emitir mientras se está guardando', () => {
    const spySubmit = jest.spyOn(component.submitLoan, 'emit');
    component.saving = true;
    component.form.setValue(NEW_LOAN_MOCK);

    component.onSubmit();

    expect(spySubmit).not.toHaveBeenCalled();
  });

  it('debería mostrar "Guardando..." en el botón mientras se guarda', () => {
    fixture.componentRef.setInput('saving', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#loan-form-submit'));
    expect(button.nativeElement.textContent.trim()).toBe('Guardando...');
  });

  it('debería limpiar el formulario al llamar reset', () => {
    component.form.setValue(NEW_LOAN_MOCK);

    component.reset();

    expect(component.form.getRawValue()).toEqual({ bookTitle: '', memberName: '', dueDate: '' });
  });
});
