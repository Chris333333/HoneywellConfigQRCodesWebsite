import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { deleteSession, getSession } from './shared/cookie.util';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'honeywell-qr-config-webiste';
  isLoggedIn = false;
  userFullName = '';
  isAndroidRoute = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAndroidRoute = this.router.url.startsWith('/android');
      }
    });
  }

  ngOnInit() {
    // Auto-login from session if fullName exists
    const fullName = getSession('fullName');
    if (fullName) {
      this.isLoggedIn = true;
      this.userFullName = fullName;
    }
    // Set initial route state
    this.isAndroidRoute = this.router.url.startsWith('/android');
  }

  handleLoginSuccess(user: any) {
    this.isLoggedIn = true;
    this.userFullName = user.fullName || '';
  }

  logout() {
    // Remove all login session values
    deleteSession('fullName');
    deleteSession('employeeId');
    deleteSession('samAccountName');
    deleteSession('email');
    deleteSession('phone');
    deleteSession('title');
    deleteSession('department');
    deleteSession('company');
    deleteSession('iduser');
    deleteSession('localID');
    this.isLoggedIn = false;
    this.userFullName = '';
  }
}
