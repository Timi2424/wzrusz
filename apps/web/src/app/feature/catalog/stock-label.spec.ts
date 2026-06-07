import { stockLabel } from './stock-label';

describe('stockLabel', () => {
  it('returns empty stock message', () => {
    expect(stockLabel(0)).toBe('Brak w magazynie');
  });

  it('returns singular form', () => {
    expect(stockLabel(1)).toBe('Dostępna 1 szt.');
  });

  it('returns few form for 2-4', () => {
    expect(stockLabel(3)).toBe('Dostępne 3 szt.');
  });

  it('returns many form for 5+', () => {
    expect(stockLabel(12)).toBe('Dostępnych 12 szt.');
  });
});
