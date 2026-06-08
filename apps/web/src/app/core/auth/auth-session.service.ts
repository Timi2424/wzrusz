import { computed, Injectable, signal } from '@angular/core';
import { AuthUser, LoginResponse } from './auth-api.model';

const TOKEN_KEY = 'wzrusz_admin_token';
const USER_KEY = 'wzrusz_admin_user';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly tokenSignal = signal<string | null>(this.readToken());
  private readonly userSignal = signal<AuthUser | null>(this.readUser());

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAdmin = computed(() => this.user()?.role === 'admin');

  setSession(response: LoginResponse): void {
    this.persistToken(response.accessToken);
    this.persistUser(response.user);
    this.tokenSignal.set(response.accessToken);
    this.userSignal.set(response.user);
  }

  setUser(user: AuthUser): void {
    this.persistUser(user);
    this.userSignal.set(user);
  }

  clear(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private persistToken(token: string): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  }

  private persistUser(user: AuthUser): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  private readToken(): string | null {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }
    return sessionStorage.getItem(TOKEN_KEY);
  }

  private readUser(): AuthUser | null {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
