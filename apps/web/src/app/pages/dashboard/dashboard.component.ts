import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Insight, Category } from '../../models/insight.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-bold text-ink">My Insights</h1>
          <p class="text-secondary-400 text-sm mt-1">Manage your knowledge base</p>
        </div>
        <a
          routerLink="/insights/new"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-ink font-medium rounded-md transition text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Insight
        </a>
      </div>

      <!-- Search & Filter -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <div class="flex-1 relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
            placeholder="Search insights…"
            class="w-full pl-10 pr-4 py-2.5 bg-secondary-900 border border-secondary-800 rounded-md text-ink placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>
        <select
          [(ngModel)]="selectedCategoryId"
          (change)="onFilterChange()"
          class="px-4 py-2.5 bg-secondary-900 border border-secondary-800 rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition min-w-[160px]"
        >
          <option [ngValue]="null">All Categories</option>
          @for (cat of categories(); track cat.id) {
            <option [ngValue]="cat.id">{{ cat.name }}</option>
          }
        </select>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="text-center py-20">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p class="text-secondary-400 mt-4">Loading insights…</p>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage(); as err) {
        <div class="bg-red-900/30 border border-red-800 text-red-300 px-6 py-4 rounded-md mb-6">
          <p>{{ err }}</p>
          <button (click)="loadInsights()" class="mt-2 text-sm text-red-200 underline hover:text-red-100">
            Try again
          </button>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && !errorMessage() && filteredInsights().length === 0) {
        <div class="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-secondary-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-medium text-secondary-300">No insights yet</h3>
          <p class="text-secondary-500 mt-1">Create your first insight to get started.</p>
          <a routerLink="/insights/new" class="inline-block mt-4 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-ink font-medium rounded-md transition text-sm">
            Create Insight
          </a>
        </div>
      }

      <!-- Insights Grid -->
      @if (!loading() && !errorMessage() && filteredInsights().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (insight of filteredInsights(); track insight.id) {
            <a
              [routerLink]="['/insights', insight.id]"
              class="block bg-secondary-900 border border-secondary-800 rounded-md p-6 hover:border-primary-700 hover: hover:-primary-900/20 transition-all group"
            >
              <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-semibold text-ink group-hover:text-primary-400 transition line-clamp-2 flex-1">
                  {{ insight.title }}
                </h3>
              </div>
              @if (insight.category) {
                <span class="inline-block px-2.5 py-1 bg-primary-900/50 text-primary-300 text-xs font-medium rounded-full mb-3">
                  {{ insight.category.name }}
                </span>
              }
              <p class="text-secondary-400 text-sm line-clamp-3 mb-4">
                {{ insight.content }}
              </p>
              <div class="flex items-center justify-between text-xs text-secondary-500">
                <span>{{ formatDate(insight.createdAt) }}</span>
                @if (insight.tags) {
                  <span class="truncate max-w-[120px]">{{ insight.tags }}</span>
                }
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  protected insights = signal<Insight[]>([]);
  protected categories = signal<Category[]>([]);
  protected loading = signal(true);
  protected errorMessage = signal<string | null>(null);
  protected searchTerm = signal('');
  protected selectedCategoryId = signal<number | null>(null);

  protected filteredInsights = computed(() => {
    let list = this.insights();
    const catId = this.selectedCategoryId();
    const search = this.searchTerm().toLowerCase();

    if (catId !== null) {
      list = list.filter(i => i.categoryId === catId);
    }

    if (search) {
      list = list.filter(i =>
        i.title.toLowerCase().includes(search) ||
        i.content.toLowerCase().includes(search) ||
        (i.tags && i.tags.toLowerCase().includes(search))
      );
    }

    return list;
  });

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadInsights(), this.loadCategories()]);
  }

  async loadInsights(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const res = await this.api.getAll<Insight[]>('insights');
      this.insights.set(res);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Failed to load insights.');
    } finally {
      this.loading.set(false);
    }
  }

  async loadCategories(): Promise<void> {
    try {
      const res = await this.api.getAll<Category[]>('categories');
      this.categories.set(res);
    } catch {
      // Categories are optional for display
    }
  }

  onSearch(): void {
    // computed() handles filtering reactively
  }

  onFilterChange(): void {
    // computed() handles filtering reactively
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
