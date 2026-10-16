import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LOANS_MOCK } from '../../../mocks/loans.mocks';
import { LoanDetailComponent } from './loan-detail.component';

describe('LoanDetailComponent', () => {
  let component: LoanDetailComponent;
  let fixture: ComponentFixture<LoanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanDetailComponent);
    component = fixture.componentInstance;
    component.loan = LOANS_MOCK[1];
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar todos los datos del préstamo', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loan = LOANS_MOCK[1];

    expect(compiled.textContent).toContain(`Préstamo #${loan.id}`);
    expect(compiled.textContent).toContain(loan.bookTitle);
    expect(compiled.textContent).toContain(loan.memberName);
    expect(compiled.textContent).toContain(loan.loanDate);
    expect(compiled.textContent).toContain(loan.dueDate);
    expect(compiled.textContent).toContain('Activo');
  });

  it('debería mapear cada estado a su BadgeType y texto correctos', () => {
    expect(component.statusMap['ACTIVE']).toBe('success');
    expect(component.statusMap['RETURNED']).toBe('secondary');
    expect(component.statusText['ACTIVE']).toBe('Activo');
    expect(component.statusText['RETURNED']).toBe('Devuelto');
  });

  it('debería emitir closeDetail al pulsar "Cerrar"', () => {
    const spyClose = jest.spyOn(component.closeDetail, 'emit');

    fixture.debugElement.query(By.css('#loan-detail-close')).nativeElement.click();

    expect(spyClose).toHaveBeenCalled();
  });
});
