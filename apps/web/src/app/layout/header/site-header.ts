import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WZRUSZ_LOGO_FALLBACK_SRC, WZRUSZ_LOGO_SRC } from '../../core/brand';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';
import { StickyHeaderController } from '../sticky-header.controller';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  protected readonly sticky = inject(StickyHeaderController);
  protected readonly dekolista = inject(DekolistaStore);
  protected readonly logoSrc = WZRUSZ_LOGO_SRC;
  protected readonly logoFallbackSrc = WZRUSZ_LOGO_FALLBACK_SRC;
}
