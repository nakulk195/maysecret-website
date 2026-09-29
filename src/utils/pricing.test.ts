import { calculateDiscountPercentage, calculateSavingsAmount } from './pricing';

describe('product pricing helpers', () => {
  it('calculates each featured product discount from its prices', () => {
    expect(calculateDiscountPercentage(999, 489)).toBe(51);
    expect(calculateDiscountPercentage(1499, 769)).toBe(49);
    expect(calculateDiscountPercentage(2498, 1149)).toBe(54);
    expect(calculateDiscountPercentage(2998, 1399)).toBe(53);
    expect(calculateDiscountPercentage(1998, 899)).toBe(55);
  });

  it('calculates savings from the same MRP and selling price', () => {
    expect(calculateSavingsAmount(999, 489)).toBe(510);
    expect(calculateSavingsAmount(2498, 1149)).toBe(1349);
  });

  it('does not return an OFF badge for invalid or non-discounted prices', () => {
    expect(calculateDiscountPercentage(undefined, 489)).toBeNull();
    expect(calculateDiscountPercentage(999, undefined)).toBeNull();
    expect(calculateDiscountPercentage(489, 489)).toBeNull();
    expect(calculateDiscountPercentage(489, 999)).toBeNull();
  });
});
