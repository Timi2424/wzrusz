import { Injectable, inject, REQUEST } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { WZRUSZ_OG_IMAGE_SRC } from '../brand';
import { PageSeo } from './page-seo.model';

@Injectable({ providedIn: 'root' })
export class PageSeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly request = inject(REQUEST, { optional: true });

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

    const ogImage = seo.ogImage ?? WZRUSZ_OG_IMAGE_SRC;
    const absoluteOgImage = this.toAbsoluteUrl(ogImage);
    this.upsertTag({ property: 'og:image', content: absoluteOgImage });
    this.upsertTag({ property: 'og:image:alt', content: 'Wzrusz — logo' });

    const origin = this.siteOrigin();
    if (origin) {
      this.upsertTag({ property: 'og:url', content: origin });
    }

    this.upsertTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.upsertTag({
      name: 'twitter:title',
      content: seo.ogTitle ?? seo.title,
    });
    this.upsertTag({
      name: 'twitter:description',
      content: seo.ogDescription ?? seo.description,
    });
    this.upsertTag({ name: 'twitter:image', content: absoluteOgImage });
  }

  private siteOrigin(): string {
    const req = this.request as { headers?: Headers; url?: string } | null;
    if (req?.headers && req.url) {
      const host = req.headers.get('host');
      if (host) {
        const proto = req.headers.get('x-forwarded-proto') ?? 'https';
        return `${proto}://${host}`;
      }
    }

    if (typeof window !== 'undefined') {
      return window.location.origin;
    }

    return '';
  }

  private toAbsoluteUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    const origin = this.siteOrigin();
    if (!origin) {
      return path;
    }
    return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
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
