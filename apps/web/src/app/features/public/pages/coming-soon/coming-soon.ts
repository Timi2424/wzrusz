import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PageSeoService } from '../../../../core/seo/page-seo.service';

@Component({
  selector: 'app-coming-soon',
  imports: [RouterLink],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoon implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pageSeo = inject(PageSeoService);

  protected title = 'Wkrótce';

  ngOnInit(): void {
    this.title = this.route.snapshot.data['title'] ?? this.title;
    this.pageSeo.apply({
      title: `${this.title} — Wzrusz`,
      description: `Sekcja ${this.title} w przygotowaniu.`,
    });
  }
}
