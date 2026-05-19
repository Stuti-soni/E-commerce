# NovaBuy Plan 2 — Home Page

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full home page — Hero, Category Section, Product Grid with filter tabs, Why Choose Us, Testimonials, Newsletter, and Footer — using Framer Motion animations, glassmorphism, and the NovaBuy design system.

**Architecture:** `app/page.tsx` is an async server component that fetches products from MongoDB directly. All interactive subcomponents (`ProductCard`, filter tabs, wishlist) are client components. A shared `AnimatedSection` wrapper handles scroll-triggered fade-ins.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React

**Prerequisite:** Plan 1 must be complete (Foundation, Navbar, CartContext).

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `components/shared/AnimatedSection.tsx` | Scroll-triggered fade-in wrapper |
| Create | `components/shared/LoadingSkeleton.tsx` | Shimmer skeleton card |
| Create | `components/home/Hero.tsx` | Animated hero with floating image |
| Create | `components/home/CategorySection.tsx` | 3 category cards |
| Create | `components/product/ProductCard.tsx` | Individual product card |
| Create | `components/home/ProductGrid.tsx` | Product listing with filter tabs |
| Create | `components/home/WhyChooseUs.tsx` | 4 feature cards |
| Create | `components/home/Testimonials.tsx` | 3 review cards |
| Create | `components/home/Newsletter.tsx` | Email subscription section |
| Create | `components/layout/Footer.tsx` | Multi-column footer |
| Modify | `app/page.tsx` | Assemble all home sections |

---

### Task 1: AnimatedSection shared component

**Files:**
- Create: `components/shared/AnimatedSection.tsx`

- [ ] **Step 1: Create components/shared/AnimatedSection.tsx**

```tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({ children, className = '', delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

---

### Task 2: LoadingSkeleton

**Files:**
- Create: `components/shared/LoadingSkeleton.tsx`

- [ ] **Step 1: Create components/shared/LoadingSkeleton.tsx**

```tsx
export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 animate-pulse">
          <div className="aspect-square bg-slate-200 dark:bg-slate-700" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Task 3: Hero section

**Files:**
- Create: `components/home/Hero.tsx`

- [ ] **Step 1: Create components/home/Hero.tsx**

```tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-slate-950">
      {/* Glow orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-sm font-medium"
          >
            <Sparkles className="w-4 h-4" />
            New arrivals just dropped
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
            The Future of
            <br />
            <span className="gradient-text">Tech Shopping</span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
            Discover premium phones, laptops, and headphones. Curated for those who demand excellence.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="#products">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-brand text-white font-semibold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="#categories">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-semibold text-base hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
              >
                View Deals
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '500+', label: 'Products' },
              { value: '4.9★', label: 'Avg Rating' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: floating product image */}
        <div className="flex justify-center lg:justify-end">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-pink-400/30 blur-2xl scale-110" />
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl glass flex items-center justify-center p-8">
              <Image
                src="/products/iphone.png"
                alt="Featured product"
                width={280}
                height={280}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-400 to-transparent" />
      </motion.div>
    </section>
  );
}
```

---

### Task 4: Category section

**Files:**
- Create: `components/home/CategorySection.tsx`

- [ ] **Step 1: Create components/home/CategorySection.tsx**

```tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Smartphone, Laptop, Headphones, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/shared/AnimatedSection';

const categories = [
  {
    name: 'Phones',
    slug: 'phones',
    description: 'Latest smartphones from top brands',
    icon: Smartphone,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40',
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    description: 'Powerful machines for work and play',
    icon: Laptop,
    gradient: 'from-purple-500 to-pink-600',
    bg: 'from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40',
  },
  {
    name: 'Headphones',
    slug: 'headphones',
    description: 'Immersive audio, premium comfort',
    icon: Headphones,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40',
  },
];

export default function CategorySection() {
  return (
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Shop by Category</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Find exactly what you're looking for across our curated collections.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <AnimatedSection key={cat.slug} delay={i * 0.1}>
              <Link href={`#products`}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-2xl p-8 bg-gradient-to-br ${cat.bg} border border-slate-200/50 dark:border-slate-700/50 cursor-pointer group transition-shadow hover:shadow-xl hover:shadow-black/5`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{cat.description}</p>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold group-hover:gap-3 transition-all">
                    Explore <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}
```

---

### Task 5: ProductCard component

**Files:**
- Create: `components/product/ProductCard.tsx`

- [ ] **Step 1: Create components/product/ProductCard.tsx**

```tsx
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
  'iPhone 14': 4.8,
  'Redmi Note 12': 4.5,
  'Samsung Galaxy S23': 4.7,
  'MacBook Air M2': 4.9,
  'MSI Gaming Laptop': 4.4,
  'ROG Zephyrus': 4.7,
  'AirPods Pro': 4.9,
  'Huawei FreeBuds': 4.3,
  'Gaming Headset': 4.5,
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
    toast.success(`${product.name} added to cart`, {
      icon: '🛒',
    });
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
        {/* Wishlist button */}
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

        {/* Image */}
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

        {/* Info */}
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
```

---

### Task 6: ProductGrid with filter tabs

**Files:**
- Create: `components/home/ProductGrid.tsx`

- [ ] **Step 1: Create components/home/ProductGrid.tsx**

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { Product } from '@/types';

const TABS = ['All', 'Phones', 'Laptops', 'Headphones'] as const;
type Tab = typeof TABS[number];

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const filtered = activeTab === 'All'
    ? products
    : products.filter(p => p.category === activeTab.toLowerCase());

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Featured Products</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Handpicked premium tech, delivered to your door.
        </p>
      </AnimatedSection>

      {/* Filter tabs */}
      <AnimatedSection delay={0.1} className="flex justify-center mb-10">
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative px-5 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute inset-0 gradient-brand rounded-xl"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className={`relative z-10 ${activeTab === tab ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                {tab}
              </span>
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Grid */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
      >
        {filtered.map((product, i) => (
          <AnimatedSection key={product._id} delay={i * 0.05}>
            <ProductCard product={product} />
          </AnimatedSection>
        ))}
      </motion.div>
    </section>
  );
}
```

---

### Task 7: Why Choose Us

**Files:**
- Create: `components/home/WhyChooseUs.tsx`

- [ ] **Step 1: Create components/home/WhyChooseUs.tsx**

```tsx
import { Zap, Shield, Star, Award } from 'lucide-react';
import AnimatedSection from '@/components/shared/AnimatedSection';

const features = [
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Same-day dispatch on all in-stock items. Free delivery over ₹999.',
    gradient: 'from-yellow-400 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Razorpay-powered checkout with 256-bit SSL encryption.',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    icon: Star,
    title: 'Premium Quality',
    description: 'Every product is verified authentic and sourced directly from brands.',
    gradient: 'from-indigo-400 to-purple-500',
  },
  {
    icon: Award,
    title: '1-Year Warranty',
    description: 'All products covered with a full 12-month manufacturer warranty.',
    gradient: 'from-pink-400 to-rose-500',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why NovaBuy?</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          We obsess over the details so you don't have to.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <AnimatedSection key={f.title} delay={i * 0.1}>
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 shadow-sm hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            </AnimatedSection>
          );
        })}
      </div>
    </section>
  );
}
```

---

### Task 8: Testimonials

**Files:**
- Create: `components/home/Testimonials.tsx`

- [ ] **Step 1: Create components/home/Testimonials.tsx**

```tsx
import { Star } from 'lucide-react';
import AnimatedSection from '@/components/shared/AnimatedSection';

const reviews = [
  {
    name: 'Arjun Mehta',
    role: 'Software Engineer',
    initials: 'AM',
    rating: 5,
    text: 'Ordered the MacBook Air M2 and it arrived the next day. Packaging was immaculate and the product is genuine. NovaBuy is my go-to now.',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    name: 'Priya Sharma',
    role: 'Content Creator',
    initials: 'PS',
    rating: 5,
    text: 'The AirPods Pro sound incredible. The checkout was super smooth — Razorpay made it effortless. Got a UPI cashback too!',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Rohan Desai',
    role: 'Gaming Enthusiast',
    initials: 'RD',
    rating: 5,
    text: "ROG Zephyrus at a great price, delivered in 2 days. Customer support resolved my query in under an hour. 10/10 experience.",
    gradient: 'from-amber-500 to-orange-600',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by Customers</h2>
        <p className="text-slate-500 dark:text-slate-400">Real reviews from real buyers.</p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <AnimatedSection key={r.name} delay={i * 0.1}>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/70 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {r.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{r.role}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-1">"{r.text}"</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
```

---

### Task 9: Newsletter

**Files:**
- Create: `components/home/Newsletter.tsx`

- [ ] **Step 1: Create components/home/Newsletter.tsx**

```tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedSection from '@/components/shared/AnimatedSection';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    toast.success('You're subscribed! Welcome to NovaBuy.', { icon: '🎉' });
    setEmail('');
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto rounded-3xl gradient-brand p-12 text-center text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/90 to-pink-600/90" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Stay in the Loop</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Get exclusive deals, new arrivals, and tech news delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl bg-white/20 backdrop-blur border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:border-white/60 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-white/90 transition-colors shrink-0"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
```

---

### Task 10: Footer

**Files:**
- Create: `components/layout/Footer.tsx`

- [ ] **Step 1: Create components/layout/Footer.tsx**

```tsx
import Link from 'next/link';
import { Zap, Twitter, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NovaBuy</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              The future of tech shopping. Premium products, seamless experience.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Github, href: '#' },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/#products' },
                { label: 'Cart', href: '/checkout' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>support@novabuy.in</li>
              <li>Mon – Sat, 9 AM – 6 PM IST</li>
              <li>Bangalore, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-400">
          © 2026 NovaBuy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

---

### Task 11: Assemble app/page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update app/page.tsx with server-side product fetch**

```tsx
import { initMongoose } from '@/lib/mongoose';
import ProductModel from '@/models/Product';
import Hero from '@/components/home/Hero';
import CategorySection from '@/components/home/CategorySection';
import ProductGrid from '@/components/home/ProductGrid';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import Footer from '@/components/layout/Footer';
import { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
  await initMongoose();
  const products = await ProductModel.find().lean().exec();
  return JSON.parse(JSON.stringify(products));
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <CategorySection />
      <ProductGrid products={products} />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create lib/mongoose.ts (typed version)**

```typescript
import mongoose from 'mongoose';

export async function initMongoose() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  return mongoose.connect(process.env.MONGODB_URL as string);
}
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3000`. Expected:
- Hero section with animated floating iPhone image, glow orbs, headline, CTA buttons
- 3 category cards
- Product grid with All/Phones/Laptops/Headphones filter tabs — 9 products showing
- Why Choose Us, Testimonials, Newsletter, Footer all visible
- Dark mode toggle works
- Add to cart shows toast notification

---

**Plan 2 complete.** Full home page assembled.
