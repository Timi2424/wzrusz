import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PageSeo } from './page-seo.model';

@Injectable({ providedIn: 'root' })
export class PageSeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  apply(seo: PageSeo): void {
    this.title.setTitle(seo.title);
    this.upsertTag({ name: 'description', content: seo.description });
    this.upsertTag({
      property: 'og:title',
      content: seo.ogTitle ?? seo.title,
    });
    this.upsertTag({
      property: 'og:description',
      content: seo.ogDescription ?? seo.description,
    });
    this.upsertTag({
      property: 'og:type',
      content: seo.ogType ?? 'website',
    });
  }

  private upsertTag(tag: {
    name?: string;
    property?: string;
    content: string;
  }): void {
    const selector = tag.name
      ? `name="${tag.name}"`
      : `property="${tag.property}"`;
    this.meta.updateTag(tag, selector);
  }
}
