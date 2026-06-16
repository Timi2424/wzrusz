import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AdminCategoryListPage } from './admin-category-list';

describe('AdminCategoryListPage', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoryListPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('renders categories from admin API', () => {
    const fixture = TestBed.createComponent(AdminCategoryListPage);
    fixture.detectChanges();

    const req = http.expectOne('/api/admin/catalog/categories');
    req.flush([
      {
        id: 'cat-1',
        name: 'Balony',
        slug: 'balony',
        sortOrder: 0,
        decorationCount: 2,
      },
    ]);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Balony');
    expect(fixture.nativeElement.textContent).toContain('2');
  });
});
