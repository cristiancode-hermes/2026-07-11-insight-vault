import { Routes } from '@angular/router';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { InsightFormComponent } from './pages/insight-form/insight-form.component';
import { InsightDetailComponent } from './pages/insight-detail/insight-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'auth', component: AuthPageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'insights/new', component: InsightFormComponent },
  { path: 'insights/:id', component: InsightDetailComponent },
  { path: 'insights/:id/edit', component: InsightFormComponent },
  { path: '**', redirectTo: '/dashboard' },
];
