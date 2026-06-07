import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();

  protected readonly socials = [
    { id: 'instagram', icon: 'pi-instagram', label: 'Instagram' },
    { id: 'facebook', icon: 'pi-facebook', label: 'Facebook' },
    { id: 'tiktok', icon: 'pi-tiktok', label: 'TikTok' },
  ] as const;

  protected readonly infoLinks = [
    { id: 'faq', label: 'FAQ', route: '/faq' },
    { id: 'privacy', label: 'Polityka prywatności', route: '/polityka-prywatnosci' },
    { id: 'terms', label: 'Regulamin', route: '/regulamin' },
  ] as const;
}
