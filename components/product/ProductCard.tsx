'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartContext } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{rating}</span>
    </div>
  );
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCartContext();
  const { toggle, isWishlisted } = useWishlist();
  const rating = RATINGS[product.name] ?? 4.5;
  const wishlisted = isWishlisted(product._id);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product._id);
    toast.success(`${product.name} added to cart`, { icon: '🛒' });
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggle(product._id);
    toast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: wishlisted ? '💔' : '❤️',
    });
  }

  return (
    <Link href={`/product/${product._id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-shadow cursor-pointer"
      >
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full glass flex items-center justify-center"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
            }`}
          />
        </motion.button>

        <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <Image
              src={product.picture}
              alt={product.name}
              width={200}
              height={200}
              className="object-contain w-full h-full drop-shadow-lg"
            />
          </motion.div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight line-clamp-1">
              {product.name}
            </h3>
            <StarRating rating={rating} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold gradient-text">
              {formatPrice(product.price)}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl gradient-brand text-white text-xs font-semibold shadow-sm hover:shadow-indigo-500/30 transition-shadow"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
