export function normalizeQuantity(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

export function parseQuantityInput(raw: string): number {
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) {
    return 1;
  }

  return normalizeQuantity(parsed);
}
