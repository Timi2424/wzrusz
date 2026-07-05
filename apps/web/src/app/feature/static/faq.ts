import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageSeoService } from '../../core/seo/page-seo.service';
import { FAQ_ITEMS } from './faq-content';

@Component({
  selector: 'app-faq',
  imports: [RouterLink],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class FaqPage implements OnInit {
  private readonly pageSeo = inject(PageSeoService);

  protected readonly items = FAQ_ITEMS;

  ngOnInit(): void {
    this.pageSeo.apply({
      title: 'FAQ — Wzrusz',
      description:
        'Najczęstsze pytania o wypożyczanie dekoracji eventowych w Poznaniu: zapytania, dostępność, faktura i kontakt.',
    });
  }
}
