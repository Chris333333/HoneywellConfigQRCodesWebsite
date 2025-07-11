import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

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

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.error = null;
    this.authService.login({ login: this.login, password: this.password }).subscribe({
      next: (user) => {
        this.loading = false;
        this.login = '';
        this.password = '';
        this.loginSuccess.emit(user.fullName);
      },
      error: () => {
        this.error = 'Login failed. Please check your credentials.';
        this.loading = false;
      }
    });
  }
}
