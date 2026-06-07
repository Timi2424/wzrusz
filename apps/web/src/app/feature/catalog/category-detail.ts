import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PageSeoService } from '../../core/seo/page-seo.service';
import { CategoryDetail, DecorationCard } from '../../core/catalog/catalog-api.model';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';
import { CatalogApiService } from './catalog-api.service';
import { stockLabel } from './stock-label';

@Component({
  selector: 'app-category-detail',
  imports: [RouterLink],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss',
})
export class CategoryDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogApi = inject(CatalogApiService);
  private readonly pageSeo = inject(PageSeoService);
  protected readonly dekolista = inject(DekolistaStore);

  protected readonly category = signal<CategoryDetail | null>(null);
  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly error = signal(false);
  protected readonly stockLabel = stockLabel;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    this.catalogApi.getCategory(slug).subscribe({
      next: (detail) => {
        this.category.set(detail);
        this.loading.set(false);
        this.pageSeo.apply({
          title: `${detail.name} — Katalog — Wzrusz`,
          description: `Dekoracje z kategorii ${detail.name}. Orientacyjny stan magazynowy przy każdej pozycji.`,
        });
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        if (err.status === 404) {
          this.notFound.set(true);
          return;
        }
        this.error.set(true);
      },
    });
  }

  protected addToDekolista(decoration: DecorationCard): void {
    const categoryName = this.category()?.name ?? 'Katalog';
    this.dekolista.addDecoration(decoration, categoryName);
  }
}
