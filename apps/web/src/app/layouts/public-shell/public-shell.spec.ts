import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PublicShell } from './public-shell';
import { Home } from '../../pages/home/home';

describe('PublicShell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicShell],
      providers: [
        provideRouter([
          {
            path: '',
            component: PublicShell,
            children: [{ path: '', component: Home }],
          },
        ]),
      ],
    }).compileComponents();
  });

  it('renders header and footer around routed content', () => {
    const fixture = TestBed.createComponent(PublicShell);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="site-header"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[data-testid="site-footer"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('router-outlet')).toBeTruthy();
  });
});
