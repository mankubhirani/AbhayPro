import { CommonModule } from '@angular/common';
import { Component, Input, Output,EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './left.component.html',
  styleUrl: './left.component.css'
})
export class LeftComponent {
  @Input() isOpen: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  toggleSidebar() {
      this.toggle.emit();
  }

}
