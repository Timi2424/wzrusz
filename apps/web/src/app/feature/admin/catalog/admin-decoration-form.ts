import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminDecoration } from '../../../core/catalog/admin-catalog-api.model';
import { AdminCatalogApiService } from '../../../core/catalog/admin-catalog-api.service';

@Component({
  selector: 'app-admin-decoration-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-decoration-form.html',
  styleUrl: './admin-category-form.scss',
})
export class AdminDecorationFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogApi = inject(AdminCatalogApiService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly deleting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isCreate = signal(false);
  protected readonly categoryId = signal('');
  protected readonly decorationId = signal<string | null>(null);
  protected readonly heading = signal('Dekoracja');
  protected readonly backLink = signal('/admin/katalog');

  protected readonly name = signal('');
  protected readonly slug = signal('');
  protected readonly description = signal('');
  protected readonly imageUrl = signal('');
  protected readonly stockQuantity = signal(0);

  ngOnInit(): void {
    const url = this.route.snapshot.url.map((segment) => segment.path);
    const isCreate = url.at(-1) === 'nowa';
    const categoryId = this.route.snapshot.paramMap.get('categoryId');
    const decorationId = this.route.snapshot.paramMap.get('id');

    if (isCreate) {
      if (!categoryId) {
        this.error.set('Brak kategorii dla nowej dekoracji.');
        this.loading.set(false);
        return;
      }

      this.isCreate.set(true);
      this.categoryId.set(categoryId);
      this.heading.set('Nowa dekoracja');
      this.backLink.set(`/admin/katalog/kategorie/${categoryId}`);
      this.loading.set(false);
      return;
    }

    if (!decorationId) {
      this.error.set('Brak identyfikatora dekoracji.');
      this.loading.set(false);
      return;
    }

    this.decorationId.set(decorationId);
    this.catalogApi.getDecoration(decorationId).subscribe({
      next: (value) => this.applyDecoration(value),
      error: () => {
        this.error.set('Nie udało się pobrać dekoracji.');
        this.loading.set(false);
      },
    });
  }

  protected save(): void {
    this.saving.set(true);
    this.error.set(null);

    const payload = {
      name: this.name(),
      slug: this.slug() || undefined,
      description: this.description(),
      imageUrl: this.imageUrl() || null,
      stockQuantity: this.stockQuantity(),
    };

    const request = this.isCreate()
      ? this.catalogApi.createDecoration({
          ...payload,
          categoryId: this.categoryId(),
        })
      : this.catalogApi.updateDecoration(this.decorationId()!, payload);

    request.subscribe({
      next: (value) => {
        if (this.isCreate()) {
          void this.router.navigate(['/admin/katalog/dekoracje', value.id]);
          return;
        }
        this.applyDecoration(value);
        this.saving.set(false);
      },
      error: () => {
        this.error.set('Nie udało się zapisać dekoracji.');
        this.saving.set(false);
      },
    });
  }

  protected deleteDecoration(): void {
    const id = this.decorationId();
    if (!id || !confirm('Usunąć dekorację?')) {
      return;
    }

    this.deleting.set(true);
    this.error.set(null);

    this.catalogApi.deleteDecoration(id).subscribe({
      next: () => {
        void this.router.navigate([this.backLink()]);
      },
      error: () => {
        this.error.set('Nie udało się usunąć dekoracji.');
        this.deleting.set(false);
      },
    });
  }

  private applyDecoration(value: AdminDecoration): void {
    this.categoryId.set(value.categoryId);
    this.name.set(value.name);
    this.slug.set(value.slug);
    this.description.set(value.description);
    this.imageUrl.set(value.imageUrl ?? '');
    this.stockQuantity.set(value.stockQuantity);
    this.heading.set(value.name);
    this.backLink.set(`/admin/katalog/kategorie/${value.categoryId}`);
    this.loading.set(false);
  }
}
