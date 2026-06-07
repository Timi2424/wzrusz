import { normalizeQuantity, parseQuantityInput } from './parse-quantity';

describe('parseQuantityInput', () => {
  it('parses valid integers', () => {
    expect(parseQuantityInput('4')).toBe(4);
  });

  it('falls back to 1 for invalid input', () => {
    expect(parseQuantityInput('')).toBe(1);
    expect(parseQuantityInput('abc')).toBe(1);
  });

  it('clamps to minimum 1', () => {
    expect(normalizeQuantity(0)).toBe(1);
    expect(parseQuantityInput('-2')).toBe(1);
  });
});
