import { createContext, useContext, useCallback, useEffect } from 'react';
import * as api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, refreshUser } = useAuth();

  const cart = user?.cart || [];
  const cartCount = cart.reduce((acc, item) => acc + (item.quantity || 0), 0);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.addToCart([{ product: productId, quantity }]);
    if (res.data?.success) {
      await refreshUser();
      return { success: true };
    }
    return { success: false, message: res.data?.message };
  };

  const setCart = async (cartItems) => {
    const cartPayload = cartItems.map((item) => ({
      product: item.product?._id || item.product,
      quantity: item.quantity,
    }));
    const res = await api.setCart(cartPayload);
    if (res.data?.success) {
      await refreshUser();
      return { success: true };
    }
    return { success: false, message: res.data?.message };
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        setCart,
        refreshCart: refreshUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
