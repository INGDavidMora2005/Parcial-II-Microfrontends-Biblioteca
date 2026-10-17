import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MEMBERS_API_URL } from '../../../infrastructure/config/api.config';
import { CreateMemberUseCase } from '../../../application/usecases/create-member.usecase';
import { GetMemberByIdUseCase } from '../../../application/usecases/get-member-by-id.usecase';
import { ListMembersUseCase } from '../../../application/usecases/list-members.usecase';
import { MembersPage } from './members.page';

/**
 * Pruebas de la página con los providers reales (MEMBERS_PROVIDERS):
 * recorren página -> casos de uso -> gateway -> HTTP simulado.
 */
describe('MembersPage', () => {
  let fixture: ComponentFixture<MembersPage>;
  let page: MembersPage;
  let http: HttpTestingController;
  const dto = (id: number) => ({ id, fullName: `Socio ${id}`, email: `socio${id}@email.com`, phone: `${id}`, active: true });
  const el = () => fixture.nativeElement as HTMLElement;
  const flushMicrotasks = () => new Promise<void>((resolve) => setTimeout(resolve));

  const init = async (list: unknown = [dto(1), dto(2)]) => {
    fixture.detectChanges();
    http.expectOne(MEMBERS_API_URL).flush(list);
    await flushMicrotasks();
    fixture.detectChanges();
  };

  const setupWith = (providers: any[]) => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MembersPage],
      providers: [provideHttpClient(), provideHttpClientTesting(), ...providers],
    });
    fixture = TestBed.createComponent(MembersPage);
    page = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  };

  beforeEach(() => {
    setupWith([]);
  });

  afterEach(() => http.verify());

  it('debe mostrar el estado de carga y luego la tabla de socios', async () => {
    fixture.detectChanges();
    expect(page.loading()).toBe(true);
    expect(el().textContent).toContain('Cargando socios...');
    http.expectOne(MEMBERS_API_URL).flush([dto(1), dto(2)]);
    await flushMicrotasks();
    fixture.detectChanges();
    expect(page.loading()).toBe(false);
    expect(el().querySelectorAll('app-members-table').length).toBe(1);
  });

  it('debe mostrar el error cuando falla la carga', async () => {
    fixture.detectChanges();
    http.expectOne(MEMBERS_API_URL).flush({ message: 'Fallo del servicio' }, { status: 500, statusText: 'Error' });
    await flushMicrotasks();
    fixture.detectChanges();
    expect(page.error()).toBe('Fallo del servicio');
  });

  it('debe usar el mensaje genérico de carga cuando el error es de red (status 0)', async () => {
    fixture.detectChanges();
    http.expectOne(MEMBERS_API_URL).error(new ProgressEvent('error'));
    await flushMicrotasks();
    fixture.detectChanges();
    expect(page.error()).toBe('No se pudo conectar con el servicio de socios');
  });

  it('debe mostrar el detalle del socio seleccionado y poder cerrarlo', async () => {
    await init();
    const promise = page.selectMember(2);
    http.expectOne(`${MEMBERS_API_URL}/2`).flush(dto(2));
    await promise;
    fixture.detectChanges();
    expect(el().querySelector('app-member-detail')).not.toBeNull();
    page.closeDetail();
    fixture.detectChanges();
    expect(el().querySelector('app-member-detail')).toBeNull();
  });

  it('debe mostrar el error cuando falla la consulta del detalle', async () => {
    await init();
    const promise = page.selectMember(99);
    http.expectOne(`${MEMBERS_API_URL}/99`).flush({ message: 'Socio inexistente' }, { status: 404, statusText: 'Not Found' });
    await promise;
    expect(page.error()).toBe('Socio inexistente');
  });

  it('debe abrir y cerrar el formulario', async () => {
    await init();
    page.openForm();
    fixture.detectChanges();
    expect(el().querySelector('app-member-form')).not.toBeNull();
    page.cancelForm();
    fixture.detectChanges();
    expect(el().querySelector('app-member-form')).toBeNull();
  });

  it('debe crear un socio, cerrar el formulario y recargar la lista', async () => {
    await init();
    page.openForm();
    const promise = page.createMember({ fullName: 'Nuevo Socio', email: 'nuevo@email.com', phone: '9' });
    http.expectOne({ method: 'POST', url: MEMBERS_API_URL }).flush({ ...dto(3), fullName: 'Nuevo Socio' }, { status: 201, statusText: 'Created' });
    await flushMicrotasks();
    http.expectOne({ method: 'GET', url: MEMBERS_API_URL }).flush([dto(1), dto(2), { ...dto(3), fullName: 'Nuevo Socio' }]);
    await promise;
    fixture.detectChanges();
    expect(page.showForm()).toBe(false);
    expect(page.successMessage()).toContain('Nuevo Socio');
  });

  it('debe mostrar el error del formulario cuando la creación falla', async () => {
    await init();
    page.openForm();
    const promise = page.createMember({ fullName: '', email: 'a@email.com', phone: '1' });
    await promise;
    expect(page.error()).toBe('El nombre completo es obligatorio');
    expect(page.showForm()).toBe(true);
  });

  it('debe usar el mensaje del Error cuando la instancia es un Error (toMessage)', () => {
    const pageAny = page as any;
    expect(pageAny.toMessage(new Error('Fallo controlado'))).toBe('Fallo controlado');
  });

  it('debe usar un mensaje genérico cuando el error no es una instancia de Error (toMessage)', () => {
    const pageAny = page as any;
    expect(pageAny.toMessage('texto')).toBe('Ocurrió un error inesperado');
  });

  it('debe limpiar los mensajes con clearMessages', () => {
    const pageAny = page as any;
    page.error.set('Algún error');
    page.successMessage.set('Socio creado');
    pageAny.clearMessages();
    expect(page.error()).toBeNull();
    expect(page.successMessage()).toBeNull();
  });

  it('debe usar el mensaje genérico de carga cuando el error no es una Error', async () => {
    const listUseCase = fixture.debugElement.injector.get(ListMembersUseCase);
    jest.spyOn(listUseCase, 'execute').mockRejectedValue('error string');
    await page.ngOnInit();
    expect(page.error()).toBe('Error al cargar los socios');
    expect(page.loading()).toBe(false);
  });

  it('debe usar el mensaje genérico de detalle cuando el error no es una Error', async () => {
    const detailUseCase = fixture.debugElement.injector.get(GetMemberByIdUseCase);
    jest.spyOn(detailUseCase, 'execute').mockRejectedValue(42);
    await page.selectMember(1);
    expect(page.error()).toBe('Error al obtener el socio');
  });

  it('debe usar el mensaje genérico de creación cuando el error no es una Error', async () => {
    const createUseCase = fixture.debugElement.injector.get(CreateMemberUseCase);
    jest.spyOn(createUseCase, 'execute').mockRejectedValue({});
    await page.createMember({ fullName: 'Nuevo', email: 'nuevo@email.com', phone: '1' });
    expect(page.error()).toBe('Error al crear el socio');
    expect(page.saving()).toBe(false);
  });
});