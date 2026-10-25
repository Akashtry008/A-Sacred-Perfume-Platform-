import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const stored = localStorage.getItem('vp_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('vp_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist:', e);
    }
  }, [wishlistIds]);

  const toggleWishlist = (productId, productTitle) => {
    if (!productId) return;
    const strId = String(productId);
    const isCurrentlySaved = wishlistIds.some((id) => String(id) === strId);

    if (isCurrentlySaved) {
      setWishlistIds((prev) => prev.filter((id) => String(id) !== strId));
      showToast(
        productTitle ? `Removed "${productTitle}" from wishlist` : 'Removed from wishlist',
        'info'
      );
    } else {
      setWishlistIds((prev) => [...prev, strId]);
      showToast(
        productTitle ? `Saved "${productTitle}" to wishlist` : 'Added to wishlist',
        'success'
      );
    }
  };

  const isWishlisted = (productId) => {
    if (!productId) return false;
    const strId = String(productId);
    return wishlistIds.some((id) => String(id) === strId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
