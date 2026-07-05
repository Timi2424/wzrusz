import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdminSchedulerPage } from './admin-scheduler';

describe('AdminSchedulerPage', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSchedulerPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('renders events from scheduler API', () => {
    const now = new Date();
    const startsAt = new Date(now.getFullYear(), now.getMonth(), 15, 12, 0, 0);
    const endsAt = new Date(now.getFullYear(), now.getMonth(), 16, 12, 0, 0);

    const fixture = TestBed.createComponent(AdminSchedulerPage);
    fixture.detectChanges();

    const req = http.expectOne((request) =>
      request.url.startsWith('/api/admin/scheduler/events'),
    );
    req.flush([
      {
        id: 'evt-1',
        title: 'Wesele Kowalscy',
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        inquiryId: null,
        occupiedDecorations: [
          {
            decorationId: 'dec-1',
            decorationName: 'Girlanda',
            quantity: 2,
          },
        ],
      },
    ]);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Wesele Kowalscy');
    expect(fixture.nativeElement.querySelector('.admin-scheduler__calendar')).toBeTruthy();
  });
});
