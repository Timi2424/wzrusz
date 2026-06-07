import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DekolistaPage } from './dekolista';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';

describe('DekolistaPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DekolistaPage],
      providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(DekolistaStore).clear();
  });

  it('shows empty state when list has no items', () => {
    const fixture = TestBed.createComponent(DekolistaPage);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="dekolista-page"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Lista jest pusta');
  });

  it('shows confirm section after approval', () => {
    const store = TestBed.inject(DekolistaStore);
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
    );

    const fixture = TestBed.createComponent(DekolistaPage);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.dekolista__actions .dekolista__cta')?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="dekolista-confirmed"]')).toBeTruthy();
  });
});
