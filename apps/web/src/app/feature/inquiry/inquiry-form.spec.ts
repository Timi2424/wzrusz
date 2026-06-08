import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { InquiryFormPage } from './inquiry-form';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';

type InquiryFormHarness = InquiryFormPage & {
  form: InquiryFormPage['form'];
  goToReview(): void;
  submitInquiry(): void;
};

describe('InquiryFormPage', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquiryFormPage],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);

    const store = TestBed.inject(DekolistaStore);
    store.clear();
    store.addDecoration(
      {
        id: 'dec-1',
        name: 'Girlanda',
        slug: 'girlanda',
        description: '',
        imageUrl: null,
        stockQuantity: 2,
      },
      'Balony',
      1,
    );
  });

  afterEach(() => {
    http.verify();
  });

  it('shows live preview with dekolista item', () => {
    const fixture = TestBed.createComponent(InquiryFormPage);
    fixture.detectChanges();

    const preview = fixture.nativeElement.querySelector('[data-testid="inquiry-preview"]');
    expect(preview?.textContent).toContain('Girlanda');
  });

  it('moves to review step when form is valid', () => {
    const fixture = TestBed.createComponent(InquiryFormPage);
    fixture.detectChanges();
    const page = fixture.componentInstance as InquiryFormHarness;

    page.form.patchValue({
      fullName: 'Anna Kowalska',
      email: 'anna@example.com',
      eventStart: '2026-08-01T10:00',
      eventEnd: '2026-08-02T18:00',
      transportAddress: 'Poznań',
    });

    page.goToReview();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="inquiry-review"]')).toBeTruthy();
  });

  it('submits inquiry and shows success', () => {
    const fixture = TestBed.createComponent(InquiryFormPage);
    fixture.detectChanges();
    const page = fixture.componentInstance as InquiryFormHarness;

    page.form.patchValue({
      fullName: 'Anna Kowalska',
      email: 'anna@example.com',
      eventStart: '2026-08-01T10:00',
      eventEnd: '2026-08-02T18:00',
      transportAddress: 'Poznań',
    });
    page.goToReview();
    fixture.detectChanges();

    page.submitInquiry();
    fixture.detectChanges();

    const req = http.expectOne((request) => request.url.includes('/api/inquiries'));
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'inq-1', status: 'submitted', createdAt: '2026-06-07T12:00:00.000Z' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="inquiry-success"]')).toBeTruthy();
    expect(TestBed.inject(DekolistaStore).isEmpty()).toBe(true);
  });

  it('stays on form when required fields are missing', () => {
    const fixture = TestBed.createComponent(InquiryFormPage);
    fixture.detectChanges();

    (fixture.componentInstance as InquiryFormHarness).goToReview();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="inquiry-form"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="inquiry-review"]')).toBeFalsy();
  });
});
