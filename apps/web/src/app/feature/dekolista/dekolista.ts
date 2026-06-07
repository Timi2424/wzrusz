import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageSeoService } from '../../core/seo/page-seo.service';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';
import { parseQuantityInput } from '../../core/dekolista/parse-quantity';

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
    this.store.setQuantity(decorationId, parseQuantityInput(raw));
  }
}
