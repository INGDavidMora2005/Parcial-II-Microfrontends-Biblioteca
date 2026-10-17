import { Component, inject, signal } from '@angular/core';
import { CreateMemberUseCase } from '../../../application/usecases/create-member.usecase';
import { GetMemberByIdUseCase } from '../../../application/usecases/get-member-by-id.usecase';
import { ListMembersUseCase } from '../../../application/usecases/list-members.usecase';
import type { Member } from '../../../domain/entities/member.entity';
import type { NewMember } from '../../../domain/entities/member.entity';
import { MembersTableComponent } from '../../components/members-table/members-table.component';
import { MemberDetailComponent } from '../../components/member-detail/member-detail.component';
import { MemberFormComponent } from '../../components/member-form/member-form.component';
import { AlertComponent } from '../../components/alert/alert.component';
import { MEMBERS_PROVIDERS } from './members.providers';

/**
 * Página del microfrontend de Socios (se expone por Module Federation).
 * @remarks
 * Solo orquesta la vista e invoca casos de uso.
 */
@Component({
  selector: 'app-members',
  standalone: true,
  imports: [MembersTableComponent, MemberDetailComponent, MemberFormComponent, AlertComponent],
  providers: MEMBERS_PROVIDERS,
  templateUrl: './members.page.html',
})
export class MembersPage {
  private readonly listMembersService = inject(ListMembersUseCase);
  private readonly getMemberByIdService = inject(GetMemberByIdUseCase);
  private readonly createMemberService = inject(CreateMemberUseCase);

  readonly members = signal<Member[]>([]);
  readonly selected = signal<Member | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly showForm = signal(false);

  async ngOnInit(): Promise<void> {
    await this.loadMembers();
  }

  async loadMembers(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.members.set(await this.listMembersService.execute());
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error al cargar los socios');
    } finally {
      this.loading.set(false);
    }
  }

  async selectMember(id: number): Promise<void> {
    this.error.set(null);
    try {
      this.selected.set(await this.getMemberByIdService.execute(id));
      this.showForm.set(false);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error al obtener el socio');
    }
  }

  async createMember(member: NewMember): Promise<void> {
    this.error.set(null);
    this.saving.set(true);
    try {
      const created = await this.createMemberService.execute(member);
      this.successMessage.set(`Socio "${created.fullName}" registrado correctamente.`);
      this.showForm.set(false);
      this.selected.set(null);
      await this.loadMembers();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error al crear el socio');
    } finally {
      this.saving.set(false);
    }
  }

  closeDetail(): void {
    this.selected.set(null);
    this.error.set(null);
  }

  openForm(): void {
    this.showForm.set(true);
    this.selected.set(null);
    this.error.set(null);
    this.successMessage.set(null);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.error.set(null);
  }

  clearMessages(): void {
    this.error.set(null);
    this.successMessage.set(null);
  }

  private toMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Ocurrió un error inesperado';
  }
}