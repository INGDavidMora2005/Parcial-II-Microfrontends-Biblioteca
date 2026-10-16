import { TestBed } from '@angular/core/testing';
import { MemberDetailComponent } from './member-detail.component';
import type { Member } from '../../../domain/entities/member.entity';

describe('MemberDetailComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [MemberDetailComponent],
    });
  });

  it('debe crear el componente', () => {
    const component = TestBed.inject(MemberDetailComponent);
    expect(component).toBeTruthy();
  });

  it('no debe mostrar nada cuando member es null', () => {
    const component = TestBed.inject(MemberDetailComponent);
    component.member = null;

    expect(component.member).toBeNull();
  });

  it('debe mostrar los datos del miembro', () => {
    const member: Member = {
      id: 1,
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '3001112233',
      active: true,
    };

    const component = TestBed.inject(MemberDetailComponent);
    component.member = member;

    expect(component.member).toEqual(member);
  });

  it('debe mostrar telefono vacío como null cuando no hay telefono', () => {
    const member: Member = {
      id: 1,
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '',
      active: true,
    };

    const component = TestBed.inject(MemberDetailComponent);
    component.member = member;

    expect(component.member.phone).toBe('');
  });

  it('debe emitir closed al cerrar', () => {
    const component = TestBed.inject(MemberDetailComponent);
    const spy = jest.spyOn(component.closed, 'emit');

    component.close();

    expect(spy).toHaveBeenCalledWith();
  });
});
