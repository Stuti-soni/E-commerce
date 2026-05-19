'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartContext } from '@/context/CartContext';
import SuccessAnimation from '@/components/shared/SuccessAnimation';

export default function SuccessHandler() {
  const params = useSearchParams();
  const { clearCart } = useCartContext();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (params.get('success') === 'true') {
      clearCart();
      setShow(true);
      const t = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(t);
    }
  }, [params]);

  if (!show) return null;
  return <SuccessAnimation />;
}
