import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { I18nService } from '../../shared/i18n.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { getSession, clearSession } from '../../shared/cookie.util';
import { LoginComponent } from "./login/login.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [CommonModule, RouterModule, TranslateModule, FormsModule, LoginComponent]
})
export class HeaderComponent {
  fullName: string = '';
  isAndroidRoute = false;
  currentLang: string;
  showLoginDropdown = false;

  constructor(private router: Router, public i18n: I18nService, private http: HttpClient, private eRef: ElementRef) {
    this.router.events.subscribe(() => {
      this.isAndroidRoute = this.router.url.startsWith('/torun');
    });
    this.currentLang = this.i18n.getCurrentLanguage();
    this.fullName = getSession('fullName') || '';
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.showLoginDropdown && this.eRef && !this.eRef.nativeElement.contains(event.target)) {
      this.showLoginDropdown = false;
    }
  }

  onLoginSuccess(fullName: string) {
    this.fullName = fullName;
    this.showLoginDropdown = false;
    this.router.navigate(['/torun']);
  }

  onLogout() {
    clearSession();
    this.fullName = '';
    this.router.navigate(['/login']);
  }

  changeLang(lang: string) {
    this.i18n.setLanguage(lang);
    this.currentLang = lang;
  }
}
