import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuthResponse } from '../models/insight.interface';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly tokenKey = 'insight_vault_token';

  private tokenSignal = signal<string | null>(null);
  readonly token = this.tokenSignal.asReadonly();

  constructor() {
    const saved = localStorage.getItem(this.tokenKey);
    if (saved) {
      this.tokenSignal.set(saved);
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await lastValueFrom(
      this.http.post<AuthResponse>('/api/auth/login', { email, password })
    );
    this.setToken(res.token);
    return res;
  }

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const res = await lastValueFrom(
      this.http.post<AuthResponse>('/api/auth/register', { email, password, name })
    );
    this.setToken(res.token);
    return res;
  }

  async getProfile(): Promise<any> {
    return lastValueFrom(
      this.http.get('/api/auth/profile')
    );
  }

  isLoggedIn(): boolean {
    return this.tokenSignal() !== null;
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  logout(): void {
    this.tokenSignal.set(null);
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/auth']);
  }

  private setToken(token: string): void {
    this.tokenSignal.set(token);
    localStorage.setItem(this.tokenKey, token);
  }
}
