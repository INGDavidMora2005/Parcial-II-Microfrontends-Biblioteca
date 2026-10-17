import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LOANS_MOCK } from '../../../mocks/loans.mocks';
import { LoansTableComponent } from './loans-table.component';

describe('LoansTableComponent', () => {
  let component: LoansTableComponent;
  let fixture: ComponentFixture<LoansTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoansTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar una tabla', () => {
    const table = fixture.debugElement.query(By.css('table.table.table-striped.border'));
    expect(table).toBeTruthy();
  });

  it('debería mostrar un mensaje cuando no hay préstamos', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No hay préstamos registrados');
  });

  it('debería renderizar una fila por cada préstamo', () => {
    component.loans = LOANS_MOCK;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(LOANS_MOCK.length);
  });

  it('debería mostrar los datos del préstamo en cada columna', () => {
    component.loans = LOANS_MOCK;
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));

    rows.forEach((row, index) => {
      const columns = row.queryAll(By.css('th, td'));
      const loan = LOANS_MOCK[index];

      expect(columns[0].nativeElement.textContent.trim()).toBe(String(loan.id));
      expect(columns[1].nativeElement.textContent.trim()).toBe(loan.bookTitle);
      expect(columns[2].nativeElement.textContent.trim()).toBe(loan.memberName);
      expect(columns[3].nativeElement.textContent.trim()).toBe(loan.loanDate);
      expect(columns[4].nativeElement.textContent.trim()).toBe(loan.dueDate);
      expect(columns[5].nativeElement.textContent.trim()).toBe(component.statusText[loan.status]);
    });
  });

  it('debería mapear cada estado a su BadgeType y texto correctos', () => {
    expect(component.statusMap['ACTIVE']).toBe('success');
    expect(component.statusMap['RETURNED']).toBe('secondary');
    expect(component.statusText['ACTIVE']).toBe('Activo');
    expect(component.statusText['RETURNED']).toBe('Devuelto');
  });

  it('debería emitir el id del préstamo al pulsar "Ver detalle"', () => {
    const spySelect = jest.spyOn(component.selectLoan, 'emit');
    component.loans = LOANS_MOCK;
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#loan-detail-2'));
    button.nativeElement.click();

    expect(spySelect).toHaveBeenCalledWith(2);
  });
});
