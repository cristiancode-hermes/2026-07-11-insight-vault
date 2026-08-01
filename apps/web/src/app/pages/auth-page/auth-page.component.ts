import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-secondary-950 px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-ink">InSight Vault</h1>
          <p class="text-secondary-400 mt-2">Sign in to your knowledge base</p>
        </div>

        <div class="bg-secondary-900 rounded-md border border-secondary-800 p-8 -2xl">
          <!-- Tabs -->
          <div class="flex mb-6 border-b border-secondary-800">
            <button
              (click)="activeTab.set('login')"
              class="flex-1 pb-3 text-sm font-medium transition-colors"
              [class.text-primary-400]="activeTab() === 'login'"
              [class.text-secondary-500]="activeTab() !== 'login'"
              [class.border-b-2]="activeTab() === 'login'"
              [class.border-primary-500]="activeTab() === 'login'"
            >
              Sign In
            </button>
            <button
              (click)="activeTab.set('register')"
              class="flex-1 pb-3 text-sm font-medium transition-colors"
              [class.text-primary-400]="activeTab() === 'register'"
              [class.text-secondary-500]="activeTab() !== 'register'"
              [class.border-b-2]="activeTab() === 'register'"
              [class.border-primary-500]="activeTab() === 'register'"
            >
              Register
            </button>
          </div>

          <!-- Error Message -->
          @if (errorMessage(); as msg) {
            <div class="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-md mb-4 text-sm">
              {{ msg }}
            </div>
          }

          <!-- Login Form -->
          @if (activeTab() === 'login') {
            <form (ngSubmit)="onLogin()" class="space-y-4">
              <div>
                <label for="login-email" class="block text-sm font-medium text-secondary-300 mb-1">Email</label>
                <input
                  id="login-email"
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  class="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-ink placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label for="login-password" class="block text-sm font-medium text-secondary-300 mb-1">Password</label>
                <input
                  id="login-password"
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  class="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-ink placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                [disabled]="loading()"
                class="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-ink font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (loading()) {
                  <span class="inline-block animate-pulse">Signing in…</span>
                } @else {
                  Sign In
                }
              </button>
            </form>
          }

          <!-- Register Form -->
          @if (activeTab() === 'register') {
            <form (ngSubmit)="onRegister()" class="space-y-4">
              <div>
                <label for="reg-name" class="block text-sm font-medium text-secondary-300 mb-1">Name</label>
                <input
                  id="reg-name"
                  type="text"
                  [(ngModel)]="name"
                  name="name"
                  required
                  class="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-ink placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label for="reg-email" class="block text-sm font-medium text-secondary-300 mb-1">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  class="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-ink placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label for="reg-password" class="block text-sm font-medium text-secondary-300 mb-1">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  class="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-ink placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                [disabled]="loading()"
                class="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-ink font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                @if (loading()) {
                  <span class="inline-block animate-pulse">Creating account…</span>
                } @else {
                  Create Account
                }
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class AuthPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected activeTab = signal<'login' | 'register'>('login');
  protected email = signal('');
  protected password = signal('');
  protected name = signal('');
  protected loading = signal(false);
  protected errorMessage = signal<string | null>(null);

  async onLogin(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      await this.auth.login(this.email(), this.password());
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Login failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  async onRegister(): Promise<void> {
    if (!this.name()) {
      this.errorMessage.set('Name is required.');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      await this.auth.register(this.email(), this.password(), this.name());
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Registration failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}
