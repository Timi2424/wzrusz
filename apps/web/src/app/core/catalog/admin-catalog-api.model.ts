export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  decorationCount: number;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  sortOrder?: number;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  sortOrder?: number;
}

export interface AdminDecoration {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  stockQuantity: number;
}

export interface CreateDecorationPayload {
  categoryId: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string | null;
  stockQuantity?: number;
}

export interface UpdateDecorationPayload {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string | null;
  stockQuantity?: number;
}
