export interface CategorySummaryDto {
  id: string;
  name: string;
  slug: string;
  decorationCount: number;
}

export interface DecorationCardDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  stockQuantity: number;
}

export interface CategoryDetailDto {
  id: string;
  name: string;
  slug: string;
  decorations: DecorationCardDto[];
}
