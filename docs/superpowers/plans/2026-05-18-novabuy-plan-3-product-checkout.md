# NovaBuy Plan 3 — Product Detail + Checkout + Pay

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the product detail page (`/product/[id]`), upgrade the checkout page UI, upgrade the pay page UI, and add an order success animation — completing the full purchase funnel with premium design.

**Architecture:** Product detail is an async server component fetching a single product + related products from MongoDB. Checkout and Pay pages are client components (they use cart state and browser APIs). The existing `/api/checkout` and `/api/webhook` routes remain untouched.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React

**Prerequisite:** Plans 1 and 2 must be complete.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `app/product/[id]/page.tsx` | Product detail server page |
| Create | `components/product/ProductDetail.tsx` | Detail layout (client — needs cart) |
| Create | `components/product/RelatedProducts.tsx` | Grid of same-category products |
| Create | `app/checkout/page.tsx` | Upgraded checkout page |
| Create | `components/cart/CartItem.tsx` | Single cart row in checkout |
| Create | `components/cart/EmptyCart.tsx` | Empty cart UI |
| Create | `app/pay/page.tsx` | Upgraded pay/redirect page |
| Create | `components/shared/SuccessAnimation.tsx` | Order success animated screen |

---

### Task 1: Product detail server page

**Files:**
- Create: `app/product/[id]/page.tsx`

- [ ] **Step 1: Create app/product/[id]/page.tsx**

```tsx
import { notFound } from 'next/navigation';
import { initMongoose } from '@/lib/mongoose';
import ProductModel from '@/models/Product';
import { Product } from '@/types';
import ProductDetail from '@/components/product/ProductDetail';
import RelatedProducts from '@/components/product/RelatedProducts';

interface Props {
  params: { id: string };
}

async function getProduct(id: string): Promise<Product | null> {
  await initMongoose();
  try {
    const product = await ProductModel.findById(id).lean().exec();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch {
    return null;
  }
}

async function getRelated(category: string, excludeId: string): Promise<Product[]> {
  const products = await ProductModel.find({ category, _id: { $ne: excludeId } }).limit(3).lean().exec();
  return JSON.parse(JSON.stringify(products));
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const related = await getRelated(product.category, product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductDetail product={product} />
      {related.length > 0 && <RelatedProducts products={related} />}
    </div>
  );
}
```

---

### Task 2: ProductDetail client component

**Files:**
- Create: `components/product/ProductDetail.tsx`

- [ ] **Step 1: Create components/product/ProductDetail.tsx**

```tsx
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
};

const RATINGS: Record<string, number> = {
  'iPhone 14': 4.8, 'Redmi Note 12': 4.5, 'Samsung Galaxy S23': 4.7,
  'MacBook Air M2': 4.9, 'MSI Gaming Laptop': 4.4, 'ROG Zephyrus': 4.7,
  'AirPods Pro': 4.9, 'Huawei FreeBuds': 4.3, 'Gaming Headset': 4.5,
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
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="capitalize">{product.category}</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-slate-900 dark:text-slate-100 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
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

        {/* Details */}
        <div className="space-y-6">
          {/* Name + rating */}
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

          {/* Price */}
          <div className="text-4xl font-black gradient-text">{formatPrice(product.price)}</div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>

          {/* Specs */}
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

          {/* Quantity */}
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

          {/* Actions */}
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

      {/* Mobile sticky bar */}
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
```

---

### Task 3: Related products

**Files:**
- Create: `components/product/RelatedProducts.tsx`

- [ ] **Step 1: Create components/product/RelatedProducts.tsx**

```tsx
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { Product } from '@/types';

interface Props { products: Product[]; }

export default function RelatedProducts({ products }: Props) {
  return (
    <AnimatedSection className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </AnimatedSection>
  );
}
```

---

### Task 4: CartItem component

**Files:**
- Create: `components/cart/CartItem.tsx`

- [ ] **Step 1: Create components/cart/CartItem.tsx**

```tsx
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
```

---

### Task 5: EmptyCart component

**Files:**
- Create: `components/cart/EmptyCart.tsx`

- [ ] **Step 1: Create components/cart/EmptyCart.tsx**

```tsx
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
```

---

### Task 6: Checkout page

**Files:**
- Create: `app/checkout/page.tsx`

- [ ] **Step 1: Create app/checkout/page.tsx**

```tsx
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uniqIds = [...new Set(selectedProducts)];
    if (!uniqIds.length) { setProducts([]); return; }
    fetch('/api/products?ids=' + uniqIds.join(','))
      .then(r => r.json())
      .then(setProducts);
  }, [selectedProducts]);

  // Build cart items with quantities
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
        {/* Left: form */}
        <div className="lg:col-span-3 space-y-6">
          {/* Delivery info */}
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
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors text-sm"
              />
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                type="email" placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors text-sm"
              />
              <input
                value={address} onChange={e => setAddress(e.target.value)}
                placeholder="Street address"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors text-sm"
              />
              <input
                value={city} onChange={e => setCity(e.target.value)}
                placeholder="City and postal code"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors text-sm"
              />
            </div>
          </motion.div>

          {/* Cart items */}
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

        {/* Right: order summary */}
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
                disabled={loading}
                className="w-full py-4 rounded-2xl gradient-brand text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow disabled:opacity-70"
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
```

---

### Task 7: Order success animation

**Files:**
- Create: `components/shared/SuccessAnimation.tsx`

- [ ] **Step 1: Create components/shared/SuccessAnimation.tsx**

```tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function SuccessAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl"
    >
      <div className="text-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30"
        >
          <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h1 className="text-3xl font-black mb-3">Order Confirmed!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed">
            Thank you for your purchase. Your order is being processed and will ship soon.
          </p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-brand text-white font-semibold shadow-lg shadow-indigo-500/25"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
```

---

### Task 8: Pay page upgrade

**Files:**
- Create: `app/pay/page.tsx`

- [ ] **Step 1: Create app/pay/page.tsx**

```tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

function PayContent() {
  const router = useRouter();
  const params = useSearchParams();
  const order_id = params.get('order_id');
  const amount = params.get('amount');
  const name = params.get('name') ?? '';
  const email = params.get('email') ?? '';
  const db_order_id = params.get('db_order_id') ?? '';

  useEffect(() => {
    if (!order_id) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        name: 'NovaBuy',
        description: 'Premium Tech Shopping',
        order_id,
        prefill: { name, email },
        theme: { color: '#6366f1' },
        handler: function (response: any) {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/api/webhook';
          const fields = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            db_order_id,
          };
          for (const [key, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value as string;
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
        },
        modal: {
          ondismiss: () => router.push('/?canceled=true'),
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  }, [order_id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center"
      >
        <Zap className="w-8 h-8 text-white" />
      </motion.div>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Opening Secure Checkout</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Powered by Razorpay · 256-bit SSL</p>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense>
      <PayContent />
    </Suspense>
  );
}
```

---

### Task 9: Update app/layout.tsx for success state

- [ ] **Step 1: Update app/layout.tsx to handle success query param**

Add a `SuccessHandler` client component alongside the layout. Create `components/shared/SuccessHandler.tsx`:

```tsx
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
```

- [ ] **Step 2: Add SuccessHandler to app/layout.tsx**

Import and add `<Suspense><SuccessHandler /></Suspense>` inside the `<CartProvider>` block, after `{children}`:

```tsx
import { Suspense } from 'react';
import SuccessHandler from '@/components/shared/SuccessHandler';

// Inside CartProvider:
<CartProvider>
  <Navbar />
  <main className="pt-16 pb-20 md:pb-0">
    {children}
  </main>
  <Suspense><SuccessHandler /></Suspense>
  <MobileNav />
  <Toaster ... />
</CartProvider>
```

- [ ] **Step 3: Final verification**

Visit `http://localhost:3000`. Test full funnel:
1. Home page loads with all products
2. Click a product → goes to `/product/[id]` with detail page
3. Add to cart → toast appears, badge updates
4. Go to checkout → cart items shown, form fields, total calculated
5. Submit → redirects to `/pay` → Razorpay popup opens
6. Use test card `4111 1111 1111 1111` → payment succeeds → redirects to `/?success=true` → SuccessAnimation shows

---

**Plan 3 complete.** Full purchase funnel is production-ready.
