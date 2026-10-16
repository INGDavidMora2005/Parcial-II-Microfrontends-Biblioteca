import { TestBed } from '@angular/core/testing';
import { MembersPage } from './members.page';
import { ListMembersUseCase } from '../../../application/usecases/list-members.usecase';
import { GetMemberByIdUseCase } from '../../../application/usecases/get-member-by-id.usecase';
import { CreateMemberUseCase } from '../../../application/usecases/create-member.usecase';
import type { Member } from '../../../domain/entities/member.entity';

const mockListMembersUseCase = {
  execute: jest.fn(),
};

const mockGetMemberByIdUseCase = {
  execute: jest.fn(),
};

const mockCreateMemberUseCase = {
  execute: jest.fn(),
};

describe('MembersPage', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        MembersPage,
        { provide: ListMembersUseCase, useValue: mockListMembersUseCase },
        { provide: GetMemberByIdUseCase, useValue: mockGetMemberByIdUseCase },
        { provide: CreateMemberUseCase, useValue: mockCreateMemberUseCase },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear el componente', () => {
    const component = TestBed.inject(MembersPage);
    expect(component).toBeTruthy();
  });

  it('debe cargar miembros al iniciar', async () => {
    const members: Member[] = [
      { id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true },
    ];
    mockListMembersUseCase.execute.mockResolvedValue(members);

    const component = TestBed.inject(MembersPage);
    await component.ngOnInit();

    expect(mockListMembersUseCase.execute).toHaveBeenCalledTimes(1);
    expect(component.members()).toEqual(members);
    expect(component.loading()).toBe(false);
  });

  it('debe mostrar error cuando falla la carga inicial', async () => {
    mockListMembersUseCase.execute.mockRejectedValue(new Error('Error de base de datos'));

    const component = TestBed.inject(MembersPage);
    await component.ngOnInit();

    expect(component.error()).toBe('Error de base de datos');
    expect(component.loading()).toBe(false);
  });

  it('debe mostrar estado vacío cuando no hay miembros', async () => {
    mockListMembersUseCase.execute.mockResolvedValue([]);

    const component = TestBed.inject(MembersPage);
    await component.ngOnInit();

    expect(component.members()).toEqual([]);
  });

  it('debe seleccionar un miembro y cargar su detalle', async () => {
    const member: Member = {
      id: 1,
      fullName: 'Juan Perez',
      email: 'juan@email.com',
      phone: '3001112233',
      active: true,
    };
    mockGetMemberByIdUseCase.execute.mockResolvedValue(member);

    const component = TestBed.inject(MembersPage);
    await component.selectMember(1);

    expect(mockGetMemberByIdUseCase.execute).toHaveBeenCalledWith(1);
    expect(component.selected()).toEqual(member);
  });

  it('debe mostrar error al seleccionar miembro inexistente', async () => {
    mockGetMemberByIdUseCase.execute.mockRejectedValue(new Error('Socio no encontrado'));

    const component = TestBed.inject(MembersPage);
    await component.selectMember(999);

    expect(component.error()).toBe('Socio no encontrado');
    expect(component.selected()).toBeNull();
  });

  it('debe crear un miembro con éxito', async () => {
    const newMember: Member = {
      id: 2,
      fullName: 'Maria Gomez',
      email: 'maria@email.com',
      phone: '3002223344',
      active: true,
    };
    mockCreateMemberUseCase.execute.mockResolvedValue(newMember);

    const component = TestBed.inject(MembersPage);
    await component.createMember({ fullName: 'Maria Gomez', email: 'maria@email.com', phone: '3002223344' });

    expect(mockCreateMemberUseCase.execute).toHaveBeenCalledWith({
      fullName: 'Maria Gomez',
      email: 'maria@email.com',
      phone: '3002223344',
    });
    expect(component.successMessage()).toBe('Socio creado correctamente');
    expect(component.showForm()).toBe(false);
    expect(component.selected()).toBeNull();
    expect(component.saving()).toBe(false);
  });

  it('debe mostrar error al crear miembro', async () => {
    mockCreateMemberUseCase.execute.mockRejectedValue(new Error('Email duplicado'));

    const component = TestBed.inject(MembersPage);
    await component.createMember({ fullName: 'Maria Gomez', email: 'maria@email.com', phone: '3002223344' });

    expect(component.error()).toBe('Email duplicado');
    expect(component.saving()).toBe(false);
  });

  it('debe mostrar estado saving al crear', async () => {
    mockCreateMemberUseCase.execute.mockResolvedValue({
      id: 2,
      fullName: 'Maria Gomez',
      email: 'maria@email.com',
      phone: '3002223344',
      active: true,
    });

    const component = TestBed.inject(MembersPage);
    const promise = component.createMember({ fullName: 'Maria Gomez', email: 'maria@email.com', phone: '3002223344' });

    expect(component.saving()).toBe(true);
    await promise;
    expect(component.saving()).toBe(false);
  });

  it('debe cerrar el detalle', async () => {
    const component = TestBed.inject(MembersPage);
    component.selected.set({ id: 1, fullName: 'Juan Perez', email: 'juan@email.com', phone: '3001112233', active: true });

    component.closeDetail();

    expect(component.selected()).toBeNull();
  });

  it('debe cancelar el formulario', async () => {
    const component = TestBed.inject(MembersPage);
    component.showForm.set(true);

    component.cancelForm();

    expect(component.showForm()).toBe(false);
  });

  it('debe abrir el formulario', async () => {
    const component = TestBed.inject(MembersPage);
    component.showForm.set(false);
    component.successMessage.set('Socio creado correctamente');

    component.openForm();

    expect(component.showForm()).toBe(true);
    expect(component.successMessage()).toBeNull();
    expect(component.error()).toBeNull();
    expect(component.selected()).toBeNull();
  });

  it('debe limpiar los mensajes', async () => {
    const component = TestBed.inject(MembersPage);
    component.error.set('Algún error');
    component.successMessage.set('Socio creado');

    component.clearMessages();

    expect(component.error()).toBeNull();
    expect(component.successMessage()).toBeNull();
  });
});
