import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { setSession } from '../shared/cookie.util';
import { HttpClient } from '@angular/common/http';

export interface LoginRequest {
  login: string;
  password: string;
}

export interface User {
  employeeId: string;
  samAccountName: string;
  fullName: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  company: string;
}

export interface UserSecondValidation {
  iduser: number;
  login: string;
  surname: string;
  localID: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /// <summary>
  /// RxJS BehaviorSubject to hold the current user state.
  /// This allows components to subscribe to user changes and react accordingly.
  /// This is useful for managing user authentication state across the application.
  /// </summary>
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<User> {
    return new Observable((observer) => {
      this.http
        .post<User>('http://localhost:5300/api/LDAP/LDAPLogin', credentials)
        .subscribe({
          next: (response) => {
            this.http
              .get<UserSecondValidation>(
                `http://localhost:5100/api/Users/ActiveUsers/login?Login=${credentials.login}&OnlyAut=true`
              )
              .subscribe({
                next: (userResp) => {
                  // Only set session if second validation succeeds
                  setSession('iduser', userResp.iduser.toString());
                  setSession('localID', userResp.localID.toString());
                  setSession('fullName', userResp.surname);
                  sessionStorage.setItem('iduser', userResp.iduser.toString());
                  sessionStorage.setItem('localID', userResp.localID.toString());
                  sessionStorage.setItem('fullName', userResp.surname);

                  Object.entries(response).forEach(([key, value]) => {
                    setSession(key, value as string);
                    sessionStorage.setItem(key, value as string);
                  });
                  this.currentUserSubject.next(response);
                  sessionStorage.setItem('isLoggedIn', 'true'); // Set login flag
                  observer.next(response);
                  observer.complete();
                },
                error: (error) => {
                  // Do NOT set session if second validation fails
                  observer.error(error);
                },
              });
          },
          error: (error) => {
            observer.error(error);
          },
        });
    });
  }

  logout(): void {
    // Clear session storage on logout
    sessionStorage.clear();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
