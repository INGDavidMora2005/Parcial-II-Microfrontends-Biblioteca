import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Member } from '../../../domain/entities/member.entity';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss',
})
export class MemberDetailComponent {

  @Input() member: Member | null = null;

  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
