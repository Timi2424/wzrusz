import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../core/api/api-config';
import { CategoryDetail, CategorySummary } from '../../core/catalog/catalog-api.model';

@Injectable({ providedIn: 'root' })
export class CatalogApiService {
  private readonly http = inject(HttpClient);

  listCategories(): Observable<CategorySummary[]> {
    return this.http.get<CategorySummary[]>(apiUrl('/api/catalog/categories'));
  }

  getCategory(slug: string): Observable<CategoryDetail> {
    return this.http.get<CategoryDetail>(apiUrl(`/api/catalog/categories/${slug}`));
  }
}
