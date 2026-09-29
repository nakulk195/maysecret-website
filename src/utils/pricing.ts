/**
 * Returns the rounded discount percentage for a valid sale price, or null when
 * there is no genuine discount to show.
 */
export const calculateDiscountPercentage = (
  mrp?: number | null,
  sellingPrice?: number | null
): number | null => {
  if (
    typeof mrp !== 'number' ||
    !Number.isFinite(mrp) ||
    typeof sellingPrice !== 'number' ||
    !Number.isFinite(sellingPrice) ||
    mrp <= 0 ||
    sellingPrice < 0 ||
    mrp <= sellingPrice
  ) {
    return null;
  }

  const discountPercentage = Math.round(
    ((mrp - sellingPrice) / mrp) * 100
  );

  return Number.isFinite(discountPercentage) && discountPercentage > 0
    ? discountPercentage
    : null;
};

/**
 * Returns the amount saved for a valid sale price, or null when no saving
 * applies. This keeps the savings label aligned with the discount badge.
 */
export const calculateSavingsAmount = (
  mrp?: number | null,
  sellingPrice?: number | null
): number | null => {
  if (calculateDiscountPercentage(mrp, sellingPrice) === null) {
    return null;
  }

  return (mrp as number) - (sellingPrice as number);
};
