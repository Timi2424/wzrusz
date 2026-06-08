import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  parseDateTimeLocal,
  startOfToday,
  WzCheckbox,
  WzDateTimePicker,
} from '@wzrusz/ui';
import { finalize, startWith } from 'rxjs';
import { buildInquiryPreview } from '../../core/inquiry/build-inquiry-preview';
import { InquiryApiService } from '../../core/inquiry/inquiry-api.service';
import { EMPTY_INQUIRY_FORM } from '../../core/inquiry/inquiry-form.model';
import { PageSeoService } from '../../core/seo/page-seo.service';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';
import { eventRangeValidator } from './inquiry-form.validators';

@Component({
  selector: 'app-inquiry-form',
  imports: [ReactiveFormsModule, RouterLink, WzCheckbox, WzDateTimePicker],
  templateUrl: './inquiry-form.html',
  styleUrl: './inquiry-form.scss',
})
export class InquiryFormPage implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly pageSeo = inject(PageSeoService);
  private readonly inquiryApi = inject(InquiryApiService);
  protected readonly dekolista = inject(DekolistaStore);

  protected readonly step = signal<'form' | 'review' | 'success'>('form');
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly submittedId = signal<string | null>(null);

  protected readonly form = this.fb.group(
    {
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      eventStart: ['', Validators.required],
      eventEnd: ['', Validators.required],
      transportAddress: ['', Validators.required],
      needsInvoice: [false],
      invoiceNotes: [''],
    },
    { validators: eventRangeValidator() },
  );

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly preview = computed(() =>
    buildInquiryPreview(
      { ...EMPTY_INQUIRY_FORM, ...this.formValue() },
      this.dekolista.entries(),
    ),
  );

  protected readonly eventEndMinDate = computed(() => {
    const startDate = parseDateTimeLocal(this.formValue()?.eventStart ?? '');
    const today = startOfToday();

    if (startDate && startDate > today) {
      return startDate;
    }

    return today;
  });

  ngOnInit(): void {
    this.pageSeo.apply({
      title: 'Zapytanie — Wzrusz',
      description:
        'Wypełnij formularz zapytania o wypożyczenie dekoracji i sprawdź podgląd wiadomości przed wysłaniem.',
    });
  }

  protected goToReview(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.step.set('review');
  }

  protected backToForm(): void {
    this.submitError.set(null);
    this.step.set('form');
  }

  protected submitInquiry(): void {
    if (this.submitting()) {
      return;
    }

    this.submitError.set(null);
    this.submitting.set(true);

    this.inquiryApi
      .submit(this.form.getRawValue(), this.dekolista.entries())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          this.submittedId.set(response.id);
          this.dekolista.clear();
          this.step.set('success');
        },
        error: () => {
          this.submitError.set(
            'Nie udało się wysłać zapytania. Sprawdź połączenie i spróbuj ponownie.',
          );
        },
      });
  }

  protected showError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  protected showEventRangeError(): boolean {
    return this.form.hasError('eventRange') && (this.form.touched || this.form.dirty);
  }
}
