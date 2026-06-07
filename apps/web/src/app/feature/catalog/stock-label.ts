export function stockLabel(quantity: number): string {
  if (quantity <= 0) {
    return 'Brak w magazynie';
  }

  if (quantity === 1) {
    return 'Dostępna 1 szt.';
  }

  const lastDigit = quantity % 10;
  const lastTwo = quantity % 100;

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) {
    return `Dostępne ${quantity} szt.`;
  }

  return `Dostępnych ${quantity} szt.`;
}
