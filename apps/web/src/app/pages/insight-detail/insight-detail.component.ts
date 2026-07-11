import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Insight } from '../../models/insight.interface';

@Component({
  selector: 'app-insight-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-3xl mx-auto">
      <!-- Back -->
      <a routerLink="/dashboard" class="text-surface-400 hover:text-white text-sm transition flex items-center gap-1 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </a>

      <!-- Loading -->
      @if (loading()) {
        <div class="text-center py-20">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          <p class="text-surface-400 mt-4">Loading insight…</p>
        </div>
      }

      <!-- Error -->
      @if (errorMessage(); as msg) {
        <div class="bg-red-900/30 border border-red-800 text-red-300 px-6 py-4 rounded-lg">
          <p>{{ msg }}</p>
          <a routerLink="/dashboard" class="mt-2 inline-block text-sm text-red-200 underline hover:text-red-100">Go to Dashboard</a>
        </div>
      }

      <!-- Detail -->
      @if (!loading() && !errorMessage() && insight(); as item) {
        <article class="bg-surface-900 border border-surface-800 rounded-xl p-8">
          <div class="flex items-start justify-between mb-6">
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-white">{{ item.title }}</h1>
              <div class="flex items-center gap-3 mt-2 text-sm text-surface-400">
                <span>{{ formatDate(item.createdAt) }}</span>
                @if (item.category) {
                  <span class="px-2.5 py-0.5 bg-primary-900/50 text-primary-300 text-xs font-medium rounded-full">
                    {{ item.category.name }}
                  </span>
                }
              </div>
            </div>
            <div class="flex items-center gap-2 ml-4">
              <a
                [routerLink]="['/insights', item.id, 'edit']"
                class="px-4 py-2 bg-surface-800 hover:bg-surface-700 text-surface-300 rounded-lg transition text-sm"
              >
                Edit
              </a>
              <button
                (click)="onDelete(item.id)"
                class="px-4 py-2 bg-red-900/40 hover:bg-red-800/60 text-red-300 rounded-lg transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>

          @if (item.tags) {
            <div class="mb-6">
              <span class="text-xs text-surface-500">Tags:</span>
              <div class="flex flex-wrap gap-2 mt-1">
                @for (tag of parseTags(item.tags); track tag) {
                  <span class="px-2 py-0.5 bg-surface-800 text-surface-300 text-xs rounded-full">{{ tag }}</span>
                }
              </div>
            </div>
          }

          <div class="prose prose-invert max-w-none text-surface-200 whitespace-pre-wrap leading-relaxed">
            {{ item.content }}
          </div>

          <div class="mt-8 pt-6 border-t border-surface-800 text-xs text-surface-500">
            Last updated: {{ formatDate(item.updatedAt) }}
          </div>
        </article>
      }
    </div>
  `,
})
export class InsightDetailComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected insight = signal<Insight | null>(null);
  protected loading = signal(true);
  protected errorMessage = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage.set('Insight ID not found.');
      this.loading.set(false);
      return;
    }

    try {
      const item = await this.api.getOne<Insight>('insights', Number(idParam));
      this.insight.set(item);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Failed to load insight.');
    } finally {
      this.loading.set(false);
    }
  }

  async onDelete(id: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this insight?')) return;

    try {
      await this.api.delete('insights', id);
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(err?.error?.message || err?.message || 'Failed to delete insight.');
    }
  }

  parseTags(tags: string): string[] {
    return tags.split(',').map(t => t.trim()).filter(t => t);
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
