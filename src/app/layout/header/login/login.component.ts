import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { setSession } from '../../../shared/cookie.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  login = '';
  password = '';
  loading = false;
  error: string | null = null;

  @Output() loginSuccess = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.http.post<any>('http://localhost:5300/api/LDAP/LDAPLogin', {
      login: this.login,
      password: this.password
    }).subscribe({
      next: (response) => {
        Object.entries(response).forEach(([key, value]) => {
          setSession(key, value as string);
        });
        this.http.get<any>(`http://localhost:5100/api/Users/ActiveUsers/login?Login=${this.login}`)
          .subscribe({
            next: (userResp) => {
              setSession('iduser', userResp.iduser);
              setSession('localID', userResp.localID);
              setSession('fullName', userResp.surname);
              this.loading = false;
              this.login = '';
              this.password = '';
              this.loginSuccess.emit(userResp.surname);
            },
            error: () => {
              this.error = 'Secondary login failed.';
              this.loading = false;
            }
          });
      },
      error: () => {
        this.error = 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }
}
