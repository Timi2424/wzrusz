export interface AdminCategoryDto {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  decorationCount: number;
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  sortOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  sortOrder?: number;
}

export interface AdminDecorationDto {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  stockQuantity: number;
}

export interface CreateDecorationDto {
  categoryId: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string | null;
  stockQuantity?: number;
}

export interface UpdateDecorationDto {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string | null;
  stockQuantity?: number;
}
