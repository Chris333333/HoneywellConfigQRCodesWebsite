import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { setSession } from '../../shared/cookie.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  login = '';
  password = '';
  loading = false;
  error: string | null = null;

  @Output() loginSuccess = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.http.post<any>('https://test', {
      login: this.login,
      password: this.password
    }).subscribe({
      next: (response) => {
        // Store all response fields in session for this session
        Object.entries(response).forEach(([key, value]) => {
          setSession(key, value as string);
        });
        // Now check the second login API
        this.http.get<any>(`https://test2`)
          .subscribe({
            next: (userResp) => {
              setSession('iduser', userResp.iduser);
              setSession('localID', userResp.localID);
              this.loading = false;
              this.loginSuccess.emit({ ...response, ...userResp });
            },
            error: () => {
              this.error = 'Secondary login failed.';
              this.loading = false;
            }
          });
      },
      error: (err) => {
        this.error = 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }
}
