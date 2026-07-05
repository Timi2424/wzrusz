import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FaqPage } from './faq';
import { FAQ_ITEMS } from './faq-content';

describe('FaqPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders FAQ items from content', () => {
    const fixture = TestBed.createComponent(FaqPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="faq-page"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.faq__item').length).toBe(FAQ_ITEMS.length);
    expect(fixture.nativeElement.textContent).toContain(FAQ_ITEMS[0].question);
  });
});
