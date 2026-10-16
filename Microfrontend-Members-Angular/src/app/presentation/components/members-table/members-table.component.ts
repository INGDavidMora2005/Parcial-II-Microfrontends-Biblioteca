import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import type { Member } from '../../../domain/entities/member.entity';

@Component({
  selector: 'app-members-table',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './members-table.component.html',
  styleUrl: './members-table.component.scss',
})
export class MembersTableComponent {

  @Input() members: Member[] = [];

  @Output() memberSelected = new EventEmitter<number>();

  trackById = (_index: number, member: Member) => member.id;

  select(member: Member) {
    this.memberSelected.emit(member.id);
  }
}