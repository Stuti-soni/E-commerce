'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Zap, Star, ChevronRight, Minus, Plus, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartContext } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

const SPECS: Record<string, string[]> = {
  phones: ['6.1" Super Retina XDR Display', '12MP Main Camera System', 'A15 Bionic Chip', '5G Capable', 'Face ID', 'Up to 20hr Battery'],
  laptops: ['Intel Core i5 / Apple M2', '8GB RAM, 256GB SSD', '13.3" Retina Display', 'USB-C / Thunderbolt', 'Wi-Fi 6 + Bluetooth 5', 'Up to 18hr Battery'],
  headphones: ['Active Noise Cancellation', 'Transparency Mode', '30hr Playback', 'USB-C Fast Charging', 'Spatial Audio', 'IPX4 Water Resistant'],
  clothes: ['Premium Quality Fabric', 'Comfortable Fit', 'Machine Washable', 'Fade-Resistant Color', 'Reinforced Stitching', 'Available in Multiple Sizes'],
  household: ['Durable Build Quality', 'Easy to Clean', 'Energy Efficient', 'Modern Design', 'Safety Certified', '1 Year Warranty'],
};

const RATINGS: Record<string, number> = {
  'iPhone 14': 4.8, 'iPhone 13': 4.7,
  'Samsung Galaxy S23': 4.7, 'Samsung Galaxy A54': 4.5,
  'Redmi Note 12': 4.5, 'Redmi Note 12 Pro': 4.6,
  'MacBook Air M2': 4.9, 'MacBook Pro M2': 4.9,
  'MSI GF63 Thin': 4.4, 'MSI Katana GF66': 4.5,
  'ROG Zephyrus G14': 4.7, 'ROG Strix G15': 4.6,
  'AirPods Pro (2nd Gen)': 4.9, 'AirPods (3rd Gen)': 4.7,
  'Huawei FreeBuds 5i': 4.3, 'Huawei FreeBuds Pro 2': 4.5,
  'HyperX Cloud II': 4.5, 'HyperX Cloud Alpha': 4.6,
  'Classic White Shirt': 4.5, 'Denim Jacket': 4.6,
  'Slim Fit Chinos': 4.4, 'Graphic Tee': 4.3,
  'Hoodie Sweatshirt': 4.7, 'Running Shorts': 4.5,
  'Air Purifier': 4.6, 'Robot Vacuum': 4.7,
  'Instant Pot Duo': 4.8, 'LED Desk Lamp': 4.5,
  'Ceramic Coffee Mug Set': 4.6, 'Bamboo Cutting Board': 4.4,
};

interface Props { product: Product; }

export default function ProductDetail({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartContext();
  const { toggle, isWishlisted } = useWishlist();
  const router = useRouter();
  const rating = RATINGS[product.name] ?? 4.5;
  const specs = SPECS[product.category] ?? [];

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) addToCart(product._id);
    toast.success(`${quantity}× ${product.name} added to cart`, { icon: '🛒' });
  }

  function handleBuyNow() {
    for (let i = 0; i < quantity; i++) addToCart(product._id);
    router.push('/checkout');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="capitalize">{product.category}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-slate-100 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-10 flex items-center justify-center aspect-square border border-slate-200/50 dark:border-slate-700/50"
        >
          <Image
            src={product.picture}
            alt={product.name}
            width={350}
            height={350}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </motion.div>

        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-3 capitalize">
              {product.category}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-3">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                ))}
              </div>
              <span className="text-sm font-semibold">{rating}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">(124 reviews)</span>
            </div>
          </div>

          <div className="text-4xl font-black gradient-text">{formatPrice(product.price)}</div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>

          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700/50 p-5">
            <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-500">Specifications</h3>
            <ul className="space-y-2">
              {specs.map(spec => (
                <li key={spec} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-500 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="w-8 text-center font-bold text-lg">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-9 rounded-xl border border-slate-300 dark:border-slate-600 flex items-center justify-center hover:border-indigo-500 hover:text-indigo-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl gradient-brand text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => toggle(product._id)}
              className="w-14 h-14 rounded-2xl border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center hover:border-rose-300 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isWishlisted(product._id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 p-4 glass border-t border-slate-200/50 dark:border-slate-700/50">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleAddToCart}
          className="w-full py-4 rounded-2xl gradient-brand text-white font-semibold flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart — {formatPrice(product.price)}
        </motion.button>
      </div>
    </motion.div>
  );
}
