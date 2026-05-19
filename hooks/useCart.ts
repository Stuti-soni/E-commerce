'use client';

import { useState, useEffect, useCallback } from 'react';

const CART_KEY = 'cart';

export function useCart() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setSelectedProducts(JSON.parse(stored));
      } catch {
        setSelectedProducts([]);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_KEY, JSON.stringify(selectedProducts));
    }
  }, [selectedProducts, mounted]);

  const addToCart = useCallback((id: string) => {
    setSelectedProducts(prev => [...prev, id]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setSelectedProducts(prev => {
      const pos = prev.indexOf(id);
      if (pos === -1) return prev;
      return prev.filter((_, i) => i !== pos);
    });
  }, []);

  const clearCart = useCallback(() => {
    setSelectedProducts([]);
  }, []);

  const cartCount = selectedProducts.length;

  return { selectedProducts, setSelectedProducts, addToCart, removeFromCart, clearCart, cartCount };
}
