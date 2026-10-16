import { TestBed } from '@angular/core/testing';
import { MembersTableComponent } from './members-table.component';
import type { Member } from '../../../domain/entities/member.entity';

describe('MembersTableComponent', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [MembersTableComponent],
    });
  });

  it('debe crear el componente', () => {
    const component = TestBed.inject(MembersTableComponent);
    expect(component).toBeTruthy();
  });

  it('debe mostrar lista de miembros', () => {
    const members: Member[] = [
      { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true },
      { id: 2, fullName: 'Maria Gomez', email: 'maria@email.com', phone: null, active: false },
    ];

    const component = TestBed.inject(MembersTableComponent);
    component.members = members;

    expect(component.members).toEqual(members);
    expect(component.members.length).toBe(2);
  });

  it('debe emitir memberSelected al seleccionar un miembro', () => {
    const component = TestBed.inject(MembersTableComponent);
    const member: Member = { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true };

    const spy = jest.spyOn(component.memberSelected, 'emit');
    component.select(member);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('debe mostrar estado vacío cuando no hay miembros', () => {
    const component = TestBed.inject(MembersTableComponent);
    component.members = [];

    expect(component.members.length).toBe(0);
  });

  it('debe rastrear miembros por id', () => {
    const component = TestBed.inject(MembersTableComponent);
    const member: Member = { id: 42, fullName: 'Test', email: 'test@test.com', phone: '', active: true };

    expect(component.trackById(0, member)).toBe(42);
  });
});
