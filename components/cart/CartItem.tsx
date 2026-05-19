'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

interface Props {
  product: Product;
  quantity: number;
}

export default function CartItem({ product, quantity }: Props) {
  const { addToCart, removeFromCart } = useCartContext();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70"
    >
      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shrink-0 p-2">
        <Image src={product.picture} alt={product.name} width={56} height={56} className="object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm leading-tight line-clamp-1">{product.name}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatPrice(product.price)} each</p>
        <p className="text-sm font-bold gradient-text mt-1">{formatPrice(product.price * quantity)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => removeFromCart(product._id)}
          className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-rose-400 hover:text-rose-500 transition-colors"
        >
          {quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
        </motion.button>
        <span className="w-6 text-center font-bold text-sm">{quantity}</span>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => addToCart(product._id)}
          className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-500 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
