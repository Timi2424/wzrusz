import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Home } from './home';
import { WZRUSZ_HOME_SEO } from '../../../../core/seo/page-seo.model';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should set SEO title and description', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    const title = TestBed.inject(Title);
    const meta = TestBed.inject(Meta);

    expect(title.getTitle()).toBe(WZRUSZ_HOME_SEO.title);
    expect(meta.getTag('name="description"')?.content).toBe(
      WZRUSZ_HOME_SEO.description,
    );
  });

  it('should render hero section for SSR', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();

    const hero = fixture.nativeElement.querySelector('[data-testid="home-hero"]');
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(hero).toBeTruthy();
    expect(h1?.textContent).toContain('Ozdób event');
  });
});
