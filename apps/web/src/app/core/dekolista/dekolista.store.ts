import { computed, Injectable, signal } from '@angular/core';
import { DecorationCard } from '../catalog/catalog-api.model';
import { DEKOLISTA_STORAGE_KEY, DekolistaItem } from './dekolista.model';

@Injectable({ providedIn: 'root' })
export class DekolistaStore {
  private readonly items = signal<DekolistaItem[]>(this.readFromStorage());
  readonly confirmed = signal(false);

  readonly entries = this.items.asReadonly();

  readonly totalQuantity = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly isEmpty = computed(() => this.items().length === 0);

  addDecoration(decoration: DecorationCard, categoryName: string): void {
    this.confirmed.set(false);
    const existing = this.items().find((item) => item.decorationId === decoration.id);

    if (existing) {
      this.items.update((list) =>
        list.map((item) =>
          item.decorationId === decoration.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      this.items.update((list) => [
        ...list,
        {
          decorationId: decoration.id,
          name: decoration.name,
          slug: decoration.slug,
          categoryName,
          quantity: 1,
        },
      ]);
    }

    this.persist();
  }

  contains(decorationId: string): boolean {
    return this.items().some((item) => item.decorationId === decorationId);
  }

  setQuantity(decorationId: string, quantity: number): void {
    const next = Math.max(1, Math.floor(quantity));
    this.confirmed.set(false);
    this.items.update((list) =>
      list.map((item) =>
        item.decorationId === decorationId ? { ...item, quantity: next } : item,
      ),
    );
    this.persist();
  }

  remove(decorationId: string): void {
    this.confirmed.set(false);
    this.items.update((list) => list.filter((item) => item.decorationId !== decorationId));
    this.persist();
  }

  clear(): void {
    this.confirmed.set(false);
    this.items.set([]);
    this.persist();
  }

  confirm(): void {
    if (!this.isEmpty()) {
      this.confirmed.set(true);
    }
  }

  private persist(): void {
    if (!this.canUseStorage()) {
      return;
    }

    localStorage.setItem(DEKOLISTA_STORAGE_KEY, JSON.stringify(this.items()));
  }

  private readFromStorage(): DekolistaItem[] {
    if (!this.canUseStorage()) {
      return [];
    }

    try {
      const raw = localStorage.getItem(DEKOLISTA_STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as DekolistaItem[];
      return Array.isArray(parsed) ? parsed.filter(isValidItem) : [];
    } catch {
      return [];
    }
  }

  private canUseStorage(): boolean {
    return (
      typeof localStorage !== 'undefined' &&
      typeof localStorage.getItem === 'function' &&
      typeof localStorage.setItem === 'function'
    );
  }
}

function isValidItem(value: unknown): value is DekolistaItem {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const item = value as Partial<DekolistaItem>;
  return (
    typeof item.decorationId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.slug === 'string' &&
    typeof item.categoryName === 'string' &&
    typeof item.quantity === 'number' &&
    item.quantity >= 1
  );
}
