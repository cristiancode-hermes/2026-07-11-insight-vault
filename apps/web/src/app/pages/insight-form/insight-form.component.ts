import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Insight, Category } from '../../models/insight.interface';

@Component({
  selector: 'app-insight-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <a routerLink="/dashboard" class="text-secondary-400 hover:text-ink text-sm transition flex items-center gap-1 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </a>
        <h1 class="text-2xl font-bold text-ink">{{ isEditMode() ? 'Edit Insight' : 'New Insight' }}</h1>
        <p class="text-secondary-400 text-sm mt-1">{{ isEditMode() ? 'Update your insight' : 'Capture a new insight' }}</p>
      </div>

      <!-- Error -->
      @if (errorMessage(); as msg) {
        <div class="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-md mb-6 text-sm">
          {{ msg }}
        </div>
      }

      <!-- Form -->
      <form (ngSubmit)="onSubmit()" class="bg-secondary-900 border border-secondary-800 rounded-md p-8 space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-secondary-300 mb-1">Title</label>
          <input
            id="title"
            type="text"
            [(ngModel)]="title"
            name="title"
            required
            class="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-ink placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="What's on your mind?"
          />
        </div>

        <!-- Content -->
        <div>
          <label for="content" class="block text-sm font-medium text-secondary-300 mb-1">Content</label>
          <textarea
            id="content"
            [(ngModel)]="content"
            name="content"
            rows="8"
            required
            class="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-ink placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-y"
            placeholder="Write your insight in detail…"
          ></textarea>
        </div>

        <!-- Category -->
        <div>
          <label for="category" class="block text-sm font-medium text-secondary-300 mb-1">Category</label>
          <select
            id="category"
            [(ngModel)]="categoryId"
            name="categoryId"
            class="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          >
            <option [ngValue]="null">No category</option>
            @for (cat of categories(); track cat.id) {
              <option [ngValue]="cat.id">{{ cat.name }}</option>
            }
          </select>
        </div>

        <!-- Tags -->
        <div>
          <label for="tags" class="block text-sm font-medium text-secondary-300 mb-1">Tags</label>
          <input
            id="tags"
            type="text"
            [(ngModel)]="tags"
            name="tags"
            class="w-full px-4 py-2.5 bg-secondary-800 border border-secondary-700 rounded-md text-ink placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            placeholder="comma, separated, tags"
          />
          <p class="text-xs text-secondary-500 mt-1">Optional: comma-separated tags</p>
        </div>

        <!-- Submit -->
        <div class="flex items-center gap-4 pt-2">
          <button
            type="submit"
            [disabled]="submitting()"
            class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-ink font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            @if (submitting()) {
              <span class="inline-block animate-pulse">{{ isEditMode() ? 'Updating…' : 'Creating…' }}</span>
            } @else {
              {{ isEditMode() ? 'Update Insight' : 'Create Insight' }}
            }
          </button>
          <a routerLink="/dashboard" class="text-secondary-400 hover:text-ink text-sm transition">Cancel</a>
        </div>
      </form>
    </div>
  `,
})
export class InsightFormComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected title = signal('');
  protected content = signal('');
  protected categoryId = signal<number | null>(null);
  protected tags = signal('');
  protected categories = signal<Category[]>([]);
  protected insightId = signal<number | null>(null);
  protected submitting = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected isEditMode = signal(false);

  async ngOnInit(): Promise<void> {
    // Load categories for the dropdown
    try {
      const cats = await this.api.getAll<Category[]>('categories');
      this.categories.set(cats);
    } catch {
      // Categories optional
    }

    // Check if editing
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.insightId.set(Number(idParam));
      await this.loadInsight(this.insightId()!);
    }
  }

  async loadInsight(id: number): Promise<void> {
    try {
      const insight = await this.api.getOne<Insight>('insights', id);
      this.title.set(insight.title);
      this.content.set(insight.content);
      this.categoryId.set(insight.categoryId ?? null);
      this.tags.set(insight.tags || '');
    } catch (err: any) {
      this.errorMessage.set('Failed to load insight for editing.');
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.title() || !this.content()) {
      this.errorMessage.set('Title and content are required.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const payload = {
      title: this.title(),
      content: this.content(),
      categoryId: this.categoryId(),
      tags: this.tags(),
    };

    try {
      if (this.isEditMode()) {
        await this.api.update('insights', this.insightId()!, payload);
      } else {
        await this.api.create('insights', payload);
      }
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Failed to save insight.');
    } finally {
      this.submitting.set(false);
    }
  }
}
