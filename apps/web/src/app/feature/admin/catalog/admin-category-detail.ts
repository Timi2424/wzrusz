import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AdminCategory,
  AdminDecoration,
} from '../../../core/catalog/admin-catalog-api.model';
import { AdminCatalogApiService } from '../../../core/catalog/admin-catalog-api.service';

@Component({
  selector: 'app-admin-category-detail',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-category-detail.html',
  styleUrl: './admin-category-detail.scss',
})
export class AdminCategoryDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogApi = inject(AdminCatalogApiService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deleting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly category = signal<AdminCategory | null>(null);
  protected readonly decorations = signal<AdminDecoration[]>([]);
  protected readonly name = signal('');
  protected readonly slug = signal('');
  protected readonly sortOrder = signal(0);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Brak identyfikatora kategorii.');
      this.loading.set(false);
      return;
    }

    this.catalogApi.getCategory(id).subscribe({
      next: (value) => {
        this.category.set(value);
        this.name.set(value.name);
        this.slug.set(value.slug);
        this.sortOrder.set(value.sortOrder);
        this.loading.set(false);
        this.loadDecorations(id);
      },
      error: () => {
        this.error.set('Nie udało się pobrać kategorii.');
        this.loading.set(false);
      },
    });
  }

  protected saveCategory(): void {
    const category = this.category();
    if (!category) {
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    this.catalogApi
      .updateCategory(category.id, {
        name: this.name(),
        slug: this.slug(),
        sortOrder: this.sortOrder(),
      })
      .subscribe({
        next: (value) => {
          this.category.set(value);
          this.saving.set(false);
        },
        error: () => {
          this.error.set('Nie udało się zapisać kategorii.');
          this.saving.set(false);
        },
      });
  }

  protected deleteCategory(): void {
    const category = this.category();
    if (!category || !confirm('Usunąć kategorię?')) {
      return;
    }

    this.deleting.set(true);
    this.error.set(null);

    this.catalogApi.deleteCategory(category.id).subscribe({
      next: () => {
        void this.router.navigate(['/admin/katalog']);
      },
      error: () => {
        this.error.set(
          'Nie udało się usunąć kategorii. Upewnij się, że nie ma w niej dekoracji.',
        );
        this.deleting.set(false);
      },
    });
  }

  private loadDecorations(categoryId: string): void {
    this.catalogApi.listDecorations(categoryId).subscribe({
      next: (rows) => this.decorations.set(rows),
      error: () => this.error.set('Nie udało się pobrać dekoracji.'),
    });
  }
}
