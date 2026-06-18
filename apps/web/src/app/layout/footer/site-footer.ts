import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WZRUSZ_SOCIAL } from '../../core/brand';

type FooterSocial =
  | {
      id: string;
      icon: string;
      label: string;
      href: string;
      soon?: false;
    }
  | {
      id: string;
      icon: string;
      label: string;
      href?: undefined;
      soon: true;
    };

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();

  protected readonly socials: FooterSocial[] = [
    {
      id: 'instagram',
      icon: 'pi-instagram',
      label: 'Instagram',
      href: WZRUSZ_SOCIAL.instagram,
    },
    {
      id: 'tiktok',
      icon: 'pi-tiktok',
      label: 'TikTok',
      href: WZRUSZ_SOCIAL.tiktok,
    },
    {
      id: 'facebook',
      icon: 'pi-facebook',
      label: 'Facebook',
      soon: true,
    },
  ];

  protected readonly infoLinks = [
    { id: 'faq', label: 'FAQ', route: '/faq' },
    { id: 'privacy', label: 'Polityka prywatności', route: '/polityka-prywatnosci' },
    { id: 'terms', label: 'Regulamin', route: '/regulamin' },
  ] as const;
}
