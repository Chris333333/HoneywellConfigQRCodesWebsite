import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class I18nService {
  constructor(private translate: TranslateService) {
    translate.addLangs(['pl', 'en']);
    translate.setDefaultLang('pl');
    const browserLang = translate.getBrowserLang();
    const lang = browserLang && browserLang.match(/en|pl/) ? browserLang : 'pl';
    translate.use(lang);
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang || 'pl';
  }
}
