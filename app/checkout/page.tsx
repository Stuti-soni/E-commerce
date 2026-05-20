'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CreditCard, MapPin } from 'lucide-react';
import { useCartContext } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import CartItem from '@/components/cart/CartItem';
import EmptyCart from '@/components/cart/EmptyCart';

export default function CheckoutPage() {
  const { selectedProducts } = useCartContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const uniqIds = Array.from(new Set(selectedProducts));
    if (!uniqIds.length) { setProducts([]); return; }
    fetch('/api/products?ids=' + uniqIds.join(','))
      .then(r => r.json())
      .then(setProducts);
  }, [selectedProducts]);

  const cartItems = products
    .map(p => ({
      product: p,
      quantity: selectedProducts.filter(id => id === p._id).length,
    }))
    .filter(item => item.quantity > 0);

  const subtotal = cartItems.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const delivery = subtotal > 0 ? 499 : 0;
  const total = subtotal + delivery;

  if (!selectedProducts.length) return <EmptyCart />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black mb-8"
      >
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-lg">Delivery Details</h2>
            </div>
            <div className="space-y-3">
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors text-sm" />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors text-sm" />
              <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors text-sm" />
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="City and postal code"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors text-sm" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-lg">Order Items</h2>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {cartItems.map(({ product, quantity }) => (
                  <CartItem key={product._id} product={product} quantity={quantity} />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-lg">Order Summary</h2>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Delivery</span>
                <span className="font-medium">{formatPrice(delivery)}</span>
              </div>
              <div className="border-t border-dashed border-slate-200 dark:border-slate-700 pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg gradient-text">{formatPrice(total)}</span>
              </div>
            </div>

            <form action="/api/checkout" method="POST">
              <input type="hidden" name="products" value={selectedProducts.join(',')} />
              <input type="hidden" name="name" value={name} />
              <input type="hidden" name="email" value={email} />
              <input type="hidden" name="address" value={address} />
              <input type="hidden" name="city" value={city} />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-4 rounded-2xl gradient-brand text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
              >
                Pay {formatPrice(total)}
              </motion.button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-3">
              Secured by Razorpay · 256-bit SSL
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
