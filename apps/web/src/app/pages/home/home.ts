import { Component, inject, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { PageSeoService } from '../../core/seo/page-seo.service';
import { WZRUSZ_HOME_SEO } from '../../core/seo/page-seo.model';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly pageSeo = inject(PageSeoService);

  ngOnInit(): void {
    this.pageSeo.apply(WZRUSZ_HOME_SEO);
  }
}
