export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  decorationCount: number;
}

export interface DecorationCard {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  stockQuantity: number;
}

export interface CategoryDetail {
  id: string;
  name: string;
  slug: string;
  decorations: DecorationCard[];
}
