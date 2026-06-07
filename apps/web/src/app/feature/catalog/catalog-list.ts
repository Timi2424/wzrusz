import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageSeoService } from '../../core/seo/page-seo.service';
import { CategorySummary } from '../../core/catalog/catalog-api.model';
import { CatalogApiService } from './catalog-api.service';

@Component({
  selector: 'app-catalog-list',
  imports: [RouterLink],
  templateUrl: './catalog-list.html',
  styleUrl: './catalog-list.scss',
})
export class CatalogList implements OnInit {
  private readonly catalogApi = inject(CatalogApiService);
  private readonly pageSeo = inject(PageSeoService);

  protected readonly categories = signal<CategorySummary[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  ngOnInit(): void {
    this.pageSeo.apply({
      title: 'Katalog — Wzrusz',
      description:
        'Przeglądaj kategorie dekoracji eventowych — balony, stoły, oświetlenie i dodatki tematyczne.',
    });

    this.catalogApi.listCategories().subscribe({
      next: (items) => {
        this.categories.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
