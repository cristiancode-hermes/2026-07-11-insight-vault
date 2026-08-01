import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <!-- Navbar -->
    <nav class="bg-secondary-200 border-b border-secondary-300 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/dashboard" class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span class="text-xl font-bold text-secondary-800">InSight Vault</span>
          </a>

          <!-- Desktop Nav -->
          <div class="hidden sm:flex items-center gap-6">
            @if (auth.isLoggedIn()) {
              <a routerLink="/dashboard" routerLinkActive="text-primary-400" class="text-secondary-600 hover:text-secondary-800 transition text-sm font-medium">
                Dashboard
              </a>
              <a routerLink="/categories" routerLinkActive="text-primary-400" class="text-secondary-600 hover:text-secondary-800 transition text-sm font-medium">
                Categories
              </a>
              <a routerLink="/insights/new" routerLinkActive="text-primary-400" class="text-secondary-600 hover:text-secondary-800 transition text-sm font-medium">
                New Insight
              </a>
              <button (click)="auth.logout()" class="text-secondary-600 hover:text-danger-500 transition text-sm font-medium">
                Logout
              </button>
            } @else {
              <a routerLink="/auth" routerLinkActive="text-primary-400" class="text-secondary-600 hover:text-secondary-800 transition text-sm font-medium">
                Sign In
              </a>
            }
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-outlet />
    </main>
  `,
})
export class App {
  protected auth = inject(AuthService);
}
