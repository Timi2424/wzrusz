import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InquiryDetail } from '../../../core/auth/auth-api.model';
import { InquiryApiService } from '../../../core/inquiry/inquiry-api.service';

@Component({
  selector: 'app-admin-inquiry-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './admin-inquiry-detail.html',
  styleUrl: './admin-inquiry-detail.scss',
})
export class AdminInquiryDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly inquiryApi = inject(InquiryApiService);

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly inquiry = signal<InquiryDetail | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Brak identyfikatora zapytania.');
      this.loading.set(false);
      return;
    }

    this.inquiryApi.getDetail(id).subscribe({
      next: (value) => {
        this.inquiry.set(value);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nie udało się pobrać szczegółów zapytania.');
        this.loading.set(false);
      },
    });
  }
}
