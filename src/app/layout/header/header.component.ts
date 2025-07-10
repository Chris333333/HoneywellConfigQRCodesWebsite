import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input() fullName: string = '';
  @Output() logout = new EventEmitter<void>();

  isAndroidRoute = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isAndroidRoute = this.router.url.startsWith('/placeholder');
    });
  }

}
