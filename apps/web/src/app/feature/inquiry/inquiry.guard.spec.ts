import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { inquiryGuard } from './inquiry.guard';
import { DekolistaStore } from '../../core/dekolista/dekolista.store';

describe('inquiryGuard', () => {
  let store: DekolistaStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    store = TestBed.inject(DekolistaStore);
    router = TestBed.inject(Router);
    store.clear();
  });

  it('redirects to dekolista when list is empty', () => {
    const result = TestBed.runInInjectionContext(() => inquiryGuard({} as never, {} as never));
    expect(result).toEqual(router.createUrlTree(['/dekolista']));
  });

  it('allows access when dekolista has items', () => {
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

    const result = TestBed.runInInjectionContext(() => inquiryGuard({} as never, {} as never));
    expect(result).toBe(true);
  });
});
