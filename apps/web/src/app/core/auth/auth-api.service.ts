import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { apiUrl } from '../api/api-config';
import {
  AuthUser,
  LoginPayload,
  LoginResponse,
} from './auth-api.model';
import { AuthSessionService } from './auth-session.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(AuthSessionService);

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(apiUrl('/api/auth/login'), payload)
      .pipe(tap((response) => this.session.setSession(response)));
  }

  loadCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(apiUrl('/api/auth/me')).pipe(
      tap((user) => this.session.setUser(user)),
    );
  }

  logout(): void {
    this.session.clear();
  }
}
