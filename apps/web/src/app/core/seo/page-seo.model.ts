export interface PageSeo {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogImage?: string;
}

export const WZRUSZ_HOME_SEO: PageSeo = {
  title: 'Wzrusz — wypożyczalnia dekoracji na eventy',
  description:
    'Przeglądaj katalog dekoracji eventowych, sprawdź dostępność i wyślij zapytanie o termin. Wypożyczalnia dekoracji — bez zakupu online.',
  ogTitle: 'Wzrusz — dekoracje na wesela, urodziny i eventy',
  ogDescription:
    'Katalog dekoracji z zapytaniem o termin. Wzrusz — wypożyczalnia dekoracji eventowych.',
  ogType: 'website',
};
