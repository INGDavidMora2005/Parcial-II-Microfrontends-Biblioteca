import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgIf],
  templateUrl: './alert.component.html',
})
export class AlertComponent {

  @Input() type: 'error' | 'success' = 'error';

  @Input() message = '';
}