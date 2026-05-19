'use client';

import { useState, useEffect, useCallback } from 'react';

const WISHLIST_KEY = 'wishlist';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(WISHLIST_KEY);
    if (stored) {
      try { setWishlist(JSON.parse(stored)); } catch { setWishlist([]); }
    }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, mounted]);

  const toggle = useCallback((id: string) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  return { wishlist, toggle, isWishlisted };
}
