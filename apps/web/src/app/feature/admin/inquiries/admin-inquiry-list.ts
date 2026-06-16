import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InquiryApiService } from '../../../core/inquiry/inquiry-api.service';
import { InquirySummary } from '../../../core/auth/auth-api.model';

@Component({
  selector: 'app-admin-inquiry-list',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './admin-inquiry-list.html',
  styleUrl: './admin-inquiry-list.scss',
})
export class AdminInquiryListPage implements OnInit {
  private readonly inquiryApi = inject(InquiryApiService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly inquiries = signal<InquirySummary[]>([]);
  protected readonly from = signal('');
  protected readonly to = signal('');

  ngOnInit(): void {
    this.fetch();
  }

  protected applyFilters(): void {
    this.fetch();
  }

  protected resetFilters(): void {
    this.from.set('');
    this.to.set('');
    this.fetch();
  }

  private fetch(): void {
    this.loading.set(true);
    this.error.set(null);

    this.inquiryApi
      .listSummaries({
        from: this.from() || undefined,
        to: this.to() || undefined,
      })
      .subscribe({
      next: (rows) => {
        this.inquiries.set(rows);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nie udało się pobrać listy zapytań.');
        this.loading.set(false);
      },
    });
  }
}
