import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { db } from '@/lib/db';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discountTotal: 0,
    shippingTotal: 0,
    taxTotal: 0,
    grandTotal: 0,
    freeShippingThreshold: 499,
    amountNeededForFreeShipping: 499,
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const getGuestToken = () => {
    if (typeof window === 'undefined') return 'gt_ssr';
    let token = localStorage.getItem('vp_guest_token');
    if (!token) {
      token = 'gt_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('vp_guest_token', token);
    }
    return token;
  };

  const syncLocalCart = useCallback(() => {
    try {
      const token = getGuestToken();
      const localCart = db.getCart({ guestToken: token });
      const localTotals = db.calculateCartTotals(localCart);
      setCart(localCart);
      setTotals(localTotals);
      return { cart: localCart, totals: localTotals };
    } catch (e) {
      console.error('Error syncing local cart:', e);
      return null;
    }
  }, []);

  const fetchCartData = useCallback(async () => {
    try {
      const token = getGuestToken();
      const res = await fetch(`/api/cart?guestToken=${token}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          setCart(data.data.cart);
          setTotals(data.data.totals);
          return;
        }
      }
      syncLocalCart();
    } catch {
      syncLocalCart();
    }
  }, [syncLocalCart]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const addToCart = async (productId, variantId, quantity = 1) => {
    setIsLoading(true);
    try {
      const token = getGuestToken();
      let handled = false;
      try {
        const res = await fetch('/api/cart/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestToken: token, productId, variantId, quantity }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            setCart(data.data.cart);
            setTotals(data.data.totals);
            handled = true;
          }
        }
      } catch {
        // network or server offline, handled by fallback
      }

      if (!handled) {
        const updated = db.addItemToCart({ guestToken: token }, productId, variantId, quantity);
        const newTotals = db.calculateCartTotals(updated);
        setCart(updated);
        setTotals(newTotals);
      }

      showToast('Sacred item added to cart', 'success');
      setIsDrawerOpen(true);
    } catch (err) {
      showToast(err.message || 'Error updating cart', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const token = getGuestToken();
      let handled = false;
      try {
        const res = await fetch(`/api/cart/items/${itemId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestToken: token, quantity }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            setCart(data.data.cart);
            setTotals(data.data.totals);
            handled = true;
          }
        }
      } catch {
        // network error
      }

      if (!handled && cart) {
        const updated = db.updateCartItem(cart.id, itemId, quantity);
        const newTotals = db.calculateCartTotals(updated);
        setCart(updated);
        setTotals(newTotals);
      }
    } catch (err) {
      showToast(err.message || 'Error updating item quantity', 'error');
    }
  };

  const removeItem = async (itemId) => {
    await updateQuantity(itemId, 0);
    showToast('Item removed from cart', 'info');
  };

  const applyCoupon = async (code) => {
    try {
      const token = getGuestToken();
      let handled = false;
      try {
        const res = await fetch('/api/cart/coupon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestToken: token, code }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            setCart(data.data.cart);
            setTotals(data.data.totals);
            showToast(data.data.message || `Coupon ${code} applied!`, 'success');
            handled = true;
          }
        }
      } catch {
        // network error
      }

      if (!handled && cart) {
        const result = db.applyCoupon(cart.id, code);
        const newTotals = db.calculateCartTotals(result.cart);
        setCart(result.cart);
        setTotals(newTotals);
        showToast(result.message || `Coupon ${code} applied!`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Error applying coupon', 'error');
    }
  };

  const removeCoupon = async () => {
    try {
      const token = getGuestToken();
      let handled = false;
      try {
        const res = await fetch('/api/cart/coupon', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestToken: token }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            setCart(data.data.cart);
            setTotals(data.data.totals);
            showToast('Coupon removed', 'info');
            handled = true;
          }
        }
      } catch {
        // network error
      }

      if (!handled && cart) {
        const updated = db.removeCoupon(cart.id);
        const newTotals = db.calculateCartTotals(updated);
        setCart(updated);
        setTotals(newTotals);
        showToast('Coupon removed', 'info');
      }
    } catch {
      showToast('Error removing coupon', 'error');
    }
  };

  const addKitBundleToCart = async (bundlePayload) => {
    setIsLoading(true);
    try {
      const token = getGuestToken();
      let handled = false;
      try {
        const res = await fetch('/api/cart/bundle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestToken: token, ...bundlePayload }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            setCart(data.data.cart);
            setTotals(data.data.totals);
            handled = true;
          }
        }
      } catch {
        // network error
      }

      if (!handled) {
        const items = bundlePayload.items || [];
        for (const it of items) {
          db.addItemToCart({ guestToken: token }, it.id || it.productId, it.variantId || 'default-var', 1);
        }
        syncLocalCart();
      }

      showToast('Sacred ritual kit added to cart with bundle savings!', 'success');
      setIsDrawerOpen(true);
      return true;
    } catch (err) {
      showToast(err.message || 'Error adding bundle to cart', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount =
    cart?.items?.filter((i) => !i.isGiftItem).reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        totals,
        itemCount,
        isDrawerOpen,
        isLoading,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        addKitBundleToCart,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        refreshCart: fetchCartData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
