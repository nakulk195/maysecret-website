import { supabase, Product } from '../lib/supabase';

/**
 * Check if a value is a valid UUID format
 * UUID format: 8-4-4-4-12 hex characters separated by hyphens
 */
export const isUuid = (value: any): boolean => {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Check if a value is numeric (number or numeric string)
 */
const isNumeric = (value: any): boolean => {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return !isNaN(Number(value)) && value.trim() !== '';
  return false;
};

/**
 * Resolve Supabase product UUID from a Product object
 * If product.id is already UUID, returns it
 * If product.id is numeric, queries Supabase using product_number
 * 
 * @param product - Product object with id field
 * @returns Supabase product UUID
 * @throws Error if product not found or query fails
 */
export const resolveSupabaseProductId = async (product: Product | any): Promise<string> => {
  const productId = product?.id;

  if (!productId) {
    throw new Error('Product must have an id field');
  }

  return resolveSupabaseProductIdFromValue(productId);
};

/**
 * Resolve Supabase product UUID from a product ID value
 * If ID is already UUID, returns it
 * If ID is numeric, queries Supabase using product_number
 * 
 * @param productId - Product ID (UUID or numeric product_number)
 * @returns Supabase product UUID
 * @throws Error if product not found or query fails
 */
export const resolveSupabaseProductIdFromValue = async (productId: string | number): Promise<string> => {
  // If already a UUID, return it as-is
  if (isUuid(productId)) {
    return String(productId);
  }

  // If numeric, query by product_number
  if (isNumeric(productId)) {
    try {
      const productNumber = Number(productId);
      
      const { data, error } = await supabase
        .from('products')
        .select('id')
        .eq('product_number', productNumber)
        .maybeSingle();

      if (error) {
        console.error(
          `[productIdResolver] Supabase query error for product_number ${productNumber}:`,
          error
        );
        throw error;
      }

      if (!data) {
        throw new Error(
          `No Supabase product found for product_number ${productNumber}`
        );
      }

      return data.id;
    } catch (error) {
      if (error instanceof Error && error.message.includes('No Supabase product found')) {
        throw error;
      }
      console.error(
        `[productIdResolver] Error resolving product_number ${productId}:`,
        error
      );
      throw error;
    }
  }

  // Invalid format
  throw new Error(
    `Invalid product ID format: "${productId}". Must be UUID or numeric product_number`
  );
};

/**
 * Resolve multiple product IDs in parallel
 * Useful for processing arrays of items (cart, orders, etc.)
 * 
 * @param productIds - Array of product IDs (UUIDs or numeric)
 * @returns Array of Supabase UUIDs in same order
 * @throws Error if any product not found
 */
export const resolveMultipleSupabaseProductIds = async (
  productIds: (string | number)[]
): Promise<string[]> => {
  const results = await Promise.all(
    productIds.map(id => resolveSupabaseProductIdFromValue(id))
  );
  return results;
};
