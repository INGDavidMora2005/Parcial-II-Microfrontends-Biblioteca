import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MembersPage } from './members.page';

describe('MembersPage', () => {
  let fixture: ComponentFixture<MembersPage>;
  let component: MembersPage;

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [MembersPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the members page', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Socios"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Socios');
  });
});
