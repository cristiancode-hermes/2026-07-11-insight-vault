import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/insight.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <a routerLink="/dashboard" class="text-surface-400 hover:text-white text-sm transition flex items-center gap-1 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </a>
        <h1 class="text-2xl font-bold text-white">Categories</h1>
        <p class="text-surface-400 text-sm mt-1">Organize your insights with categories</p>
      </div>

      <!-- Error -->
      @if (errorMessage(); as msg) {
        <div class="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
          {{ msg }}
        </div>
      }

      <!-- Loading -->
      @if (loading()) {
        <div class="text-center py-16">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p class="text-surface-400 mt-4">Loading categories…</p>
        </div>
      }

      <!-- Inline Create Form -->
      @if (!loading()) {
        <div class="bg-surface-900 border border-surface-800 rounded-xl p-6 mb-8">
          <h3 class="text-sm font-medium text-surface-300 mb-4">Create New Category</h3>
          <div class="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              [(ngModel)]="newName"
              placeholder="Category name"
              class="flex-1 px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
            <input
              type="text"
              [(ngModel)]="newDescription"
              placeholder="Description (optional)"
              class="flex-1 px-4 py-2.5 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
            <button
              (click)="onCreate()"
              [disabled]="creating() || !newName().trim()"
              class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
            >
              @if (creating()) {
                <span class="inline-block animate-pulse">Creating…</span>
              } @else {
                Create
              }
            </button>
          </div>
        </div>
      }

      <!-- Category List -->
      @if (!loading() && categories().length === 0) {
        <div class="text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-surface-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 class="text-lg font-medium text-surface-300">No categories yet</h3>
          <p class="text-surface-500 mt-1">Create your first category above.</p>
        </div>
      }

      @if (!loading() && categories().length > 0) {
        <div class="space-y-3">
          @for (cat of categories(); track cat.id) {
            <div class="bg-surface-900 border border-surface-800 rounded-xl p-5 flex items-center justify-between gap-4">
              @if (editingId() === cat.id) {
                <!-- Edit Mode -->
                <div class="flex-1 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    [(ngModel)]="editName"
                    placeholder="Name"
                    class="flex-1 px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  <input
                    type="text"
                    [(ngModel)]="editDescription"
                    placeholder="Description"
                    class="flex-1 px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button
                    (click)="onSaveEdit(cat.id)"
                    [disabled]="savingEdit()"
                    class="px-3 py-1.5 bg-accent-500 hover:bg-accent-600 text-white text-xs font-medium rounded-lg transition disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    (click)="cancelEdit()"
                    class="px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-surface-300 text-xs rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              } @else {
                <!-- Display Mode -->
                <div class="flex-1 min-w-0">
                  <h3 class="text-white font-medium">{{ cat.name }}</h3>
                  @if (cat.description) {
                    <p class="text-surface-400 text-sm mt-0.5 truncate">{{ cat.description }}</p>
                  }
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button
                    (click)="startEdit(cat)"
                    class="px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-surface-300 text-xs rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    (click)="onDelete(cat.id)"
                    class="px-3 py-1.5 bg-red-900/40 hover:bg-red-800/60 text-red-300 text-xs rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class CategoriesComponent implements OnInit {
  private api = inject(ApiService);

  protected categories = signal<Category[]>([]);
  protected loading = signal(true);
  protected errorMessage = signal<string | null>(null);

  // New category form
  protected newName = signal('');
  protected newDescription = signal('');
  protected creating = signal(false);

  // Edit state
  protected editingId = signal<number | null>(null);
  protected editName = signal('');
  protected editDescription = signal('');
  protected savingEdit = signal(false);

  async ngOnInit(): Promise<void> {
    await this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const cats = await this.api.getAll<Category[]>('categories');
      this.categories.set(cats);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Failed to load categories.');
    } finally {
      this.loading.set(false);
    }
  }

  async onCreate(): Promise<void> {
    if (!this.newName().trim()) return;
    this.creating.set(true);
    try {
      await this.api.create('categories', {
        name: this.newName().trim(),
        description: this.newDescription().trim() || undefined,
      });
      this.newName.set('');
      this.newDescription.set('');
      await this.loadCategories();
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Failed to create category.');
    } finally {
      this.creating.set(false);
    }
  }

  startEdit(cat: Category): void {
    this.editingId.set(cat.id);
    this.editName.set(cat.name);
    this.editDescription.set(cat.description || '');
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editName.set('');
    this.editDescription.set('');
  }

  async onSaveEdit(id: number): Promise<void> {
    if (!this.editName().trim()) return;
    this.savingEdit.set(true);
    try {
      await this.api.update('categories', id, {
        name: this.editName().trim(),
        description: this.editDescription().trim() || undefined,
      });
      this.cancelEdit();
      await this.loadCategories();
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Failed to update category.');
    } finally {
      this.savingEdit.set(false);
    }
  }

  async onDelete(id: number): Promise<void> {
    if (!confirm('Delete this category? Insights in this category will not be deleted, but will lose their category association.')) return;
    try {
      await this.api.delete('categories', id);
      await this.loadCategories();
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Failed to delete category.');
    }
  }
}
