import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageSeoService } from '../../core/seo/page-seo.service';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';

@Component({
  selector: 'app-dekolista',
  imports: [RouterLink],
  templateUrl: './dekolista.html',
  styleUrl: './dekolista.scss',
})
export class DekolistaPage implements OnInit {
  protected readonly store = inject(DekolistaStore);
  private readonly pageSeo = inject(PageSeoService);

  ngOnInit(): void {
    this.pageSeo.apply({
      title: 'Dekolista — Wzrusz',
      description:
        'Przejrzyj wybrane dekoracje, dopasuj ilości i zatwierdź listę przed wysłaniem zapytania.',
    });
  }

  protected confirmList(): void {
    this.store.confirm();
  }

  protected changeQuantity(decorationId: string, raw: string): void {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      return;
    }
    this.store.setQuantity(decorationId, parsed);
  }
}
