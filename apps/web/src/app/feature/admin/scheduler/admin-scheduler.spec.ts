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
    const fixture = TestBed.createComponent(AdminSchedulerPage);
    fixture.detectChanges();

    const req = http.expectOne((request) =>
      request.url.startsWith('/api/admin/scheduler/events'),
    );
    req.flush([
      {
        id: 'evt-1',
        title: 'Wesele Kowalscy',
        startsAt: '2026-06-15T08:00:00.000Z',
        endsAt: '2026-06-16T16:00:00.000Z',
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
