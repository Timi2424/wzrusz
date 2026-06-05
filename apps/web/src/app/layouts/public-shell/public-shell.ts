import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from '../../components/site-footer/site-footer';
import { SiteHeader } from '../../components/site-header/site-header';
import { StickyHeaderController } from '../../core/scroll/sticky-header.controller';

@Component({
  selector: 'app-public-shell',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  providers: [StickyHeaderController],
  templateUrl: './public-shell.html',
  styleUrl: './public-shell.scss',
})
export class PublicShell implements OnInit {
  private readonly stickyHeader = inject(StickyHeaderController);

  ngOnInit(): void {
    this.stickyHeader.attach();
  }
}
