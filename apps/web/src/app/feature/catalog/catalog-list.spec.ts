import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CatalogList } from './catalog-list';

describe('CatalogList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('renders category cards from API', () => {
    const fixture = TestBed.createComponent(CatalogList);
    fixture.detectChanges();

    const req = http.expectOne('/api/catalog/categories');
    req.flush([
      {
        id: 'cat-1',
        name: 'Balony i girlandy',
        slug: 'balony-i-girlandy',
        decorationCount: 2,
      },
    ]);

    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.catalog__card');
    expect(card?.textContent).toContain('Balony i girlandy');
    expect(card?.getAttribute('href')).toBe('/katalog/balony-i-girlandy');
  });
});
