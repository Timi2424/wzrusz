import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { InquiryApiService } from '../../../core/inquiry/inquiry-api.service';
import { InquirySummary } from '../../../core/auth/auth-api.model';

@Component({
  selector: 'app-admin-inquiry-list',
  imports: [DatePipe],
  templateUrl: './admin-inquiry-list.html',
  styleUrl: './admin-inquiry-list.scss',
})
export class AdminInquiryListPage implements OnInit {
  private readonly inquiryApi = inject(InquiryApiService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly inquiries = signal<InquirySummary[]>([]);

  ngOnInit(): void {
    this.inquiryApi.listSummaries().subscribe({
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
