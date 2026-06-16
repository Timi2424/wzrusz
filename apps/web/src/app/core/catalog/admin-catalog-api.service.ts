import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../api/api-config';
import {
  AdminCategory,
  AdminDecoration,
  CreateCategoryPayload,
  CreateDecorationPayload,
  UpdateCategoryPayload,
  UpdateDecorationPayload,
} from './admin-catalog-api.model';

@Injectable({ providedIn: 'root' })
export class AdminCatalogApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/admin/catalog';

  listCategories(): Observable<AdminCategory[]> {
    return this.http.get<AdminCategory[]>(apiUrl(`${this.base}/categories`));
  }

  getCategory(id: string): Observable<AdminCategory> {
    return this.http.get<AdminCategory>(apiUrl(`${this.base}/categories/${id}`));
  }

  createCategory(payload: CreateCategoryPayload): Observable<AdminCategory> {
    return this.http.post<AdminCategory>(
      apiUrl(`${this.base}/categories`),
      payload,
    );
  }

  updateCategory(
    id: string,
    payload: UpdateCategoryPayload,
  ): Observable<AdminCategory> {
    return this.http.patch<AdminCategory>(
      apiUrl(`${this.base}/categories/${id}`),
      payload,
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(apiUrl(`${this.base}/categories/${id}`));
  }

  listDecorations(categoryId: string): Observable<AdminDecoration[]> {
    return this.http.get<AdminDecoration[]>(
      apiUrl(`${this.base}/categories/${categoryId}/decorations`),
    );
  }

  getDecoration(id: string): Observable<AdminDecoration> {
    return this.http.get<AdminDecoration>(
      apiUrl(`${this.base}/decorations/${id}`),
    );
  }

  createDecoration(payload: CreateDecorationPayload): Observable<AdminDecoration> {
    return this.http.post<AdminDecoration>(
      apiUrl(`${this.base}/decorations`),
      payload,
    );
  }

  updateDecoration(
    id: string,
    payload: UpdateDecorationPayload,
  ): Observable<AdminDecoration> {
    return this.http.patch<AdminDecoration>(
      apiUrl(`${this.base}/decorations/${id}`),
      payload,
    );
  }

  deleteDecoration(id: string): Observable<void> {
    return this.http.delete<void>(apiUrl(`${this.base}/decorations/${id}`));
  }
}
