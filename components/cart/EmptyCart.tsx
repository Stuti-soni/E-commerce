'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
        <ShoppingCart className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
        Looks like you haven't added anything yet. Start browsing our collection.
      </p>
      <Link href="/">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-8 py-4 rounded-2xl gradient-brand text-white font-semibold shadow-lg shadow-indigo-500/25"
        >
          Browse Products
        </motion.button>
      </Link>
    </motion.div>
  );
}
