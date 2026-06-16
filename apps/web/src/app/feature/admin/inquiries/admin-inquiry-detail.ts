import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  InquiryAvailability,
  InquiryDetail,
} from '../../../core/auth/auth-api.model';
import { InquiryApiService } from '../../../core/inquiry/inquiry-api.service';

@Component({
  selector: 'app-admin-inquiry-detail',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './admin-inquiry-detail.html',
  styleUrl: './admin-inquiry-detail.scss',
})
export class AdminInquiryDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly inquiryApi = inject(InquiryApiService);

  protected readonly loading = signal(true);
  protected readonly approving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly approveError = signal<string | null>(null);
  protected readonly inquiry = signal<InquiryDetail | null>(null);
  protected readonly availability = signal<InquiryAvailability | null>(null);
  protected readonly quantities = signal<Record<string, number>>({});

  protected readonly canApprove = computed(() => {
    const availability = this.availability();
    if (!availability) {
      return false;
    }

    return availability.items.every((item) => {
      const requested = this.quantities()[item.lineItemId] ?? item.requestedQuantity;
      return requested <= item.availableQuantity;
    });
  });

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
        this.quantities.set(
          Object.fromEntries(value.lineItems.map((line) => [line.id, line.quantity])),
        );
        this.loading.set(false);
        if (value.status === 'submitted') {
          this.loadAvailability(id);
        }
      },
      error: () => {
        this.error.set('Nie udało się pobrać szczegółów zapytania.');
        this.loading.set(false);
      },
    });
  }

  protected updateQuantity(lineItemId: string, value: number): void {
    this.quantities.update((current) => ({
      ...current,
      [lineItemId]: value,
    }));
  }

  protected approve(): void {
    const inquiry = this.inquiry();
    if (!inquiry || inquiry.status !== 'submitted' || !this.canApprove()) {
      return;
    }

    this.approving.set(true);
    this.approveError.set(null);

    const payload = {
      lineItems: inquiry.lineItems.map((line) => ({
        lineItemId: line.id,
        quantity: this.quantities()[line.id] ?? line.quantity,
      })),
    };

    this.inquiryApi.approve(inquiry.id, payload).subscribe({
      next: () => {
        this.inquiry.set({ ...inquiry, status: 'approved' });
        this.availability.set(null);
        this.approving.set(false);
      },
      error: () => {
        this.approveError.set('Nie udało się zatwierdzić rezerwacji.');
        this.approving.set(false);
      },
    });
  }

  protected availabilityFor(lineItemId: string) {
    return this.availability()?.items.find((item) => item.lineItemId === lineItemId);
  }

  protected lineStatus(lineItemId: string): 'ok' | 'shortage' | null {
    const item = this.availabilityFor(lineItemId);
    if (!item) {
      return null;
    }

    const requested = this.quantities()[lineItemId] ?? item.requestedQuantity;
    return requested <= item.availableQuantity ? 'ok' : 'shortage';
  }

  private loadAvailability(id: string): void {
    this.inquiryApi.getAvailability(id).subscribe({
      next: (value) => this.availability.set(value),
      error: () => this.approveError.set('Nie udało się sprawdzić dostępności.'),
    });
  }
}
