import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { I18nService } from '../../shared/i18n.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule,TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input() fullName: string = '';
  @Output() logout = new EventEmitter<void>();

  isAndroidRoute = false;
  currentLang: string;

  constructor(private router: Router, public i18n: I18nService) {
    this.router.events.subscribe(() => {
      this.isAndroidRoute = this.router.url.startsWith('/placeholder');
    });
    this.currentLang = this.i18n.getCurrentLanguage();
  }

  changeLang(lang: string) {
    this.i18n.setLanguage(lang);
    this.currentLang = lang;
  }
}
