import { Component, inject, signal } from '@angular/core';

import { MemberRepository } from '../../../domain/repositories/member.repository';
import { MemberApiGateway } from '../../../infrastructure/gateways/member-api.gateway';
import { ListMembersUseCase } from '../../../application/usecases/list-members.usecase';
import { GetMemberByIdUseCase } from '../../../application/usecases/get-member-by-id.usecase';
import { CreateMemberUseCase } from '../../../application/usecases/create-member.usecase';
import type { Member } from '../../../domain/entities/member.entity';
import type { NewMember } from '../../../domain/entities/member.entity';

import { MembersTableComponent } from '../../components/members-table/members-table.component';
import { MemberDetailComponent } from '../../components/member-detail/member-detail.component';
import { MemberFormComponent } from '../../components/member-form/member-form.component';
import { AlertComponent } from '../../components/alert/alert.component';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [MembersTableComponent, MemberDetailComponent, MemberFormComponent, AlertComponent],
  providers: [
    { provide: MemberRepository, useClass: MemberApiGateway },
    ListMembersUseCase,
    GetMemberByIdUseCase,
    CreateMemberUseCase,
  ],
  templateUrl: './members.page.html',
})
export class MembersPage {

  private readonly listMembersUseCase = inject(ListMembersUseCase);
  private readonly getMemberByIdUseCase = inject(GetMemberByIdUseCase);
  private readonly createMemberUseCase = inject(CreateMemberUseCase);

  members = signal<Member[]>([]);
  selected = signal<Member | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showForm = signal(false);

  async ngOnInit() {
    await this.loadMembers();
  }

  async loadMembers() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const members = await this.listMembersUseCase.execute();
      this.members.set(members);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error al cargar los socios');
    } finally {
      this.loading.set(false);
    }
  }

  async selectMember(id: number) {
    this.error.set(null);
    try {
      const member = await this.getMemberByIdUseCase.execute(id);
      this.selected.set(member);
      this.showForm.set(false);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error al obtener el socio');
    }
  }

  async createMember(member: NewMember) {
    this.error.set(null);
    this.saving.set(true);
    try {
      await this.createMemberUseCase.execute(member);
      this.successMessage.set('Socio creado correctamente');
      this.showForm.set(false);
      this.selected.set(null);
      await this.loadMembers();
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Error al crear el socio');
    } finally {
      this.saving.set(false);
    }
  }

  closeDetail() {
    this.selected.set(null);
    this.error.set(null);
  }

  openForm() {
    this.showForm.set(true);
    this.selected.set(null);
    this.error.set(null);
    this.successMessage.set(null);
  }

  cancelForm() {
    this.showForm.set(false);
    this.error.set(null);
  }

  clearMessages() {
    this.error.set(null);
    this.successMessage.set(null);
  }
}
