import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminCategory } from '../../../core/catalog/admin-catalog-api.model';
import { AdminCatalogApiService } from '../../../core/catalog/admin-catalog-api.service';

@Component({
  selector: 'app-admin-category-list',
  imports: [RouterLink],
  templateUrl: './admin-category-list.html',
  styleUrl: './admin-category-list.scss',
})
export class AdminCategoryListPage implements OnInit {
  private readonly catalogApi = inject(AdminCatalogApiService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly categories = signal<AdminCategory[]>([]);

  ngOnInit(): void {
    this.fetch();
  }

  private fetch(): void {
    this.loading.set(true);
    this.error.set(null);

    this.catalogApi.listCategories().subscribe({
      next: (rows) => {
        this.categories.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nie udało się pobrać kategorii.');
        this.loading.set(false);
      },
    });
  }
}
