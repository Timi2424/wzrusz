import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminCatalogApiService } from '../../../core/catalog/admin-catalog-api.service';

@Component({
  selector: 'app-admin-category-create',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-category-form.html',
  styleUrl: './admin-category-form.scss',
})
export class AdminCategoryCreatePage {
  private readonly catalogApi = inject(AdminCatalogApiService);
  private readonly router = inject(Router);

  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly name = signal('');
  protected readonly slug = signal('');
  protected readonly sortOrder = signal(0);
  protected readonly heading = 'Nowa kategoria';
  protected readonly backLink = '/admin/katalog';

  protected save(): void {
    this.saving.set(true);
    this.error.set(null);

    this.catalogApi
      .createCategory({
        name: this.name(),
        slug: this.slug() || undefined,
        sortOrder: this.sortOrder(),
      })
      .subscribe({
        next: (category) => {
          void this.router.navigate(['/admin/katalog/kategorie', category.id]);
        },
        error: () => {
          this.error.set('Nie udało się utworzyć kategorii.');
          this.saving.set(false);
        },
      });
  }
}
