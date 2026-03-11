// Cart validation utilities to prevent crashes from missing fields

export interface SafeProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

export interface SafeCartItem {
  _id: string;
  product: SafeProduct;
  quantity: number;
}

/**
 * Validates a cart item and returns whether it's valid
 * @param item - The cart item to validate
 * @param index - Index of the item in the cart array
 * @returns true if valid, false if invalid
 */
export const validateCartItem = (item: any, index: number): boolean => {
  if (!item) {
    console.warn(`Cart validation: Item at index ${index} is undefined/null`);
    return false;
  }

  if (!item.product) {
    console.warn(`Cart validation: Item at index ${index} is missing product object:`, item);
    return false;
  }

  const { product } = item;
  const missingFields = [];

  if (!product._id) missingFields.push('_id');
  if (!product.name) missingFields.push('name');
  if (typeof product.price !== 'number') missingFields.push('price');
  if (!product.image) missingFields.push('image');

  if (missingFields.length > 0) {
    console.warn(`Cart validation: Item at index ${index} is missing fields: ${missingFields.join(', ')}`, item);
  }

  return true;
};

/**
 * Gets safe product values with fallbacks for missing fields
 * @param product - The product object
 * @returns Safe product with fallback values
 */
export const getSafeProductValues = (product: any): SafeProduct => {
  return {
    id: product._id || 'unknown',
    name: product.name || 'Unnamed Product',
    price: typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0,
    image: product.image || '/placeholder.svg',
    inStock: product.inStock !== undefined ? product.inStock : true
  };
};

/**
 * Filters cart to only include valid items
 * @param cart - The cart array
 * @returns Array of valid cart items
 */
export const filterValidCartItems = (cart: any[]): SafeCartItem[] => {
  if (!Array.isArray(cart)) {
    console.warn('Cart validation: Cart is not an array:', cart);
    return [];
  }

  return cart
    .map((item, index) => {
      if (!validateCartItem(item, index)) {
        return null;
      }
      
      const safeProduct = getSafeProductValues(item.product);
      
      return {
        _id: item._id || `item-${index}`,
        product: safeProduct,
        quantity: typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 0
      };
    })
    .filter(Boolean) as SafeCartItem[];
};

/**
 * Calculates cart total safely, handling invalid items
 * @param cart - The cart array
 * @returns Total price
 */
export const calculateSafeCartTotal = (cart: any[]): number => {
  return filterValidCartItems(cart).reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

/**
 * Calculates cart count safely, handling invalid items
 * @param cart - The cart array
 * @returns Total item count
 */
export const calculateSafeCartCount = (cart: any[]): number => {
  return filterValidCartItems(cart).reduce((count, item) => {
    return count + item.quantity;
  }, 0);
};
