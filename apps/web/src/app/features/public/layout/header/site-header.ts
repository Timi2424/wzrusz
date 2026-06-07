import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WZRUSZ_LOGO_SRC } from '../../brand';
import { StickyHeaderController } from '../sticky-header.controller';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  protected readonly sticky = inject(StickyHeaderController);
  protected readonly logoSrc = WZRUSZ_LOGO_SRC;
}
