import { supabaseClient } from '../lib/supabaseClient';

export const cartService = {
  // Get cart items for logged-in user
  getUserCart: async (userId) => {
    try {
      const { data, error } = await supabaseClient.fetch('shopping_cart', {
        select: `
          *,
          products (
            id,
            name,
            price,
            image_urls,
            slug,
            stock_quantity,
            status
          )
        `,
        eq: { column: 'user_id', value: userId },
        order: { column: 'created_at', ascending: false }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get cart items for guest user (using session ID)
  getGuestCart: async (sessionId) => {
    try {
      const { data, error } = await supabaseClient.fetch('shopping_cart', {
        select: `
          *,
          products (
            id,
            name,
            price,
            image_urls,
            slug,
            stock_quantity,
            status
          )
        `,
        eq: { column: 'session_id', value: sessionId },
        order: { column: 'created_at', ascending: false }
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity, userId = null, sessionId = null) => {
    try {
      // Check if product exists and is in stock
      const { data: product, error: productError } = await supabaseClient.fetch('products', {
        select: 'id, name, price, stock_quantity, status',
        eq: { column: 'id', value: productId },
        single: true
      });

      if (productError) {
        throw new Error(productError.message);
      }

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.status !== 'active') {
        throw new Error('Product is not available');
      }

      if (product.stock_quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      // Check if item already in cart
      const existingItemCondition = userId 
        ? { column: 'user_id', value: userId }
        : { column: 'session_id', value: sessionId };

      const { data: existingItem, error: fetchError } = await supabaseClient.fetch('shopping_cart', {
        select: 'id, quantity',
        eq: existingItemCondition,
        eq: { column: 'product_id', value: productId },
        single: true
      });

      let result;
      if (existingItem && !fetchError) {
        // Update existing item
        const newQuantity = existingItem.quantity + quantity;
        const { data, error } = await supabaseClient.update('shopping_cart', {
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        }, { column: 'id', value: existingItem.id });

        if (error) {
          throw new Error(error.message);
        }
        result = { data, action: 'updated' };
      } else {
        // Add new item
        const cartData = {
          product_id: productId,
          quantity,
          created_at: new Date().toISOString()
        };

        if (userId) {
          cartData.user_id = userId;
        } else {
          cartData.session_id = sessionId;
        }

        const { data, error } = await supabaseClient.insert('shopping_cart', cartData);

        if (error) {
          throw new Error(error.message);
        }
        result = { data, action: 'added' };
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId, quantity, userId = null, sessionId = null) => {
    try {
      // Verify ownership
      const ownershipCondition = userId 
        ? { column: 'user_id', value: userId }
        : { column: 'session_id', value: sessionId };

      const { data: cartItem, error: fetchError } = await supabaseClient.fetch('shopping_cart', {
        select: 'id, quantity, product_id',
        eq: { column: 'id', value: cartItemId },
        eq: ownershipCondition,
        single: true
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      // Check product stock
      const { data: product, error: productError } = await supabaseClient.fetch('products', {
        select: 'stock_quantity',
        eq: { column: 'id', value: cartItem.product_id },
        single: true
      });

      if (productError) {
        throw new Error(productError.message);
      }

      if (product.stock_quantity < quantity) {
        throw new Error('Insufficient stock');
      }

      const { data, error } = await supabaseClient.update('shopping_cart', {
        quantity,
        updated_at: new Date().toISOString()
      }, { column: 'id', value: cartItemId });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId, userId = null, sessionId = null) => {
    try {
      // Verify ownership
      const ownershipCondition = userId 
        ? { column: 'user_id', value: userId }
        : { column: 'session_id', value: sessionId };

      const { data: cartItem, error: fetchError } = await supabaseClient.fetch('shopping_cart', {
        select: 'id',
        eq: { column: 'id', value: cartItemId },
        eq: ownershipCondition,
        single: true
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!cartItem) {
        throw new Error('Cart item not found');
      }

      const { error } = await supabaseClient.delete('shopping_cart', { 
        column: 'id', 
        value: cartItemId 
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Clear cart
  clearCart: async (userId = null, sessionId = null) => {
    try {
      const condition = userId 
        ? { column: 'user_id', value: userId }
        : { column: 'session_id', value: sessionId };

      const { error } = await supabaseClient.delete('shopping_cart', condition);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Merge guest cart to user cart when they log in
  mergeGuestCartToUserCart: async (sessionId, userId) => {
    try {
      // Get guest cart items
      const { data: guestItems, error: fetchError } = await cartService.getGuestCart(sessionId);

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!guestItems || guestItems.length === 0) {
        return { success: true, data: [] };
      }

      // Get user cart items
      const { data: userItems, error: userFetchError } = await cartService.getUserCart(userId);

      if (userFetchError) {
        throw new Error(userFetchError.message);
      }

      const mergedItems = [];
      const userProductIds = userItems ? userItems.map(item => item.product_id) : [];

      // Add guest items to user cart
      for (const guestItem of guestItems) {
        if (!userProductIds.includes(guestItem.product_id)) {
          const { data, error } = await supabaseClient.insert('shopping_cart', {
            user_id: userId,
            product_id: guestItem.product_id,
            quantity: guestItem.quantity,
            created_at: new Date().toISOString()
          });

          if (!error) {
            mergedItems.push(data);
          }
        }
      }

      // Clear guest cart
      await cartService.clearCart(null, sessionId);

      return { success: true, data: mergedItems };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get cart summary
  getCartSummary: async (userId = null, sessionId = null) => {
    try {
      const cartItems = userId 
        ? (await cartService.getUserCart(userId)).data || []
        : (await cartService.getGuestCart(sessionId)).data || [];

      if (cartItems.length === 0) {
        return {
          success: true,
          data: {
            items: [],
            totalItems: 0,
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0
          }
        };
      }

      const subtotal = cartItems.reduce((sum, item) => {
        return sum + (parseFloat(item.products.price) * item.quantity);
      }, 0);

      const tax = subtotal * 0.18; // 18% GST
      const shipping = subtotal > 500 ? 0 : 50; // Free shipping above 500
      const total = subtotal + tax + shipping;

      return {
        success: true,
        data: {
          items: cartItems,
          totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          shipping: parseFloat(shipping.toFixed(2)),
          total: parseFloat(total.toFixed(2))
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default cartService;
