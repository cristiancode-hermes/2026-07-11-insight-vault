import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api';

  getAll<T>(endpoint: string): Promise<T> {
    return lastValueFrom(this.http.get<T>(`${this.baseUrl}/${endpoint}`));
  }

  getOne<T>(endpoint: string, id: number): Promise<T> {
    return lastValueFrom(this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`));
  }

  create<T>(endpoint: string, data: any): Promise<T> {
    return lastValueFrom(this.http.post<T>(`${this.baseUrl}/${endpoint}`, data));
  }

  update<T>(endpoint: string, id: number, data: any): Promise<T> {
    return lastValueFrom(this.http.patch<T>(`${this.baseUrl}/${endpoint}/${id}`, data));
  }

  delete<T>(endpoint: string, id: number): Promise<T> {
    return lastValueFrom(this.http.delete<T>(`${this.baseUrl}/${endpoint}/${id}`));
  }

  search<T>(endpoint: string, term: string): Promise<T> {
    return lastValueFrom(this.http.get<T>(`${this.baseUrl}/${endpoint}?search=${encodeURIComponent(term)}`));
  }
}
