import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { InquiryFormPage } from './inquiry-form';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';

type InquiryFormHarness = InquiryFormPage & {
  form: InquiryFormPage['form'];
  goToReview(): void;
};

describe('InquiryFormPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquiryFormPage],
      providers: [
        provideRouter([]),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura } }),
      ],
    }).compileComponents();

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

  it('stays on form when required fields are missing', () => {
    const fixture = TestBed.createComponent(InquiryFormPage);
    fixture.detectChanges();

    (fixture.componentInstance as InquiryFormHarness).goToReview();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="inquiry-form"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="inquiry-review"]')).toBeFalsy();
  });
});
