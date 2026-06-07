import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteFooter } from '../footer/site-footer';
import { SiteHeader } from '../header/site-header';
import { StickyHeaderController } from '../sticky-header.controller';

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
