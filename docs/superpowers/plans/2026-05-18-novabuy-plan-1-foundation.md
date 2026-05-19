# NovaBuy Plan 1 — Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade Next.js 12 Pages Router project to Next.js 14 App Router with TypeScript, install all new dependencies, scaffold the app directory, create the cart hook, dark mode, and Navbar — leaving all `pages/api/` routes completely untouched.

**Architecture:** Add `app/` directory alongside existing `pages/` (Next.js supports hybrid mode). Convert config files to TypeScript. Install framer-motion, lucide-react, next-themes, react-hot-toast. Replace `use-local-storage-state` cart with a custom `useCart` hook.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lucide React, next-themes, react-hot-toast

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `package.json` | Upgrade next, add new deps |
| Create | `tsconfig.json` | TypeScript config |
| Modify | `next.config.js → next.config.ts` | Enable App Router |
| Modify | `tailwind.config.js → tailwind.config.ts` | Add darkMode: class, extend theme |
| Modify | `styles/globals.css` | Add CSS variables, font imports |
| Create | `types/index.ts` | Product, Order, CartItem interfaces |
| Create | `lib/utils.ts` | cn() helper, formatPrice() |
| Create | `lib/mongoose.ts` | Same as mongoose.js, typed |
| Create | `hooks/useCart.ts` | localStorage cart hook |
| Create | `hooks/useWishlist.ts` | localStorage wishlist hook |
| Create | `context/CartContext.tsx` | CartProvider wrapping app |
| Create | `app/layout.tsx` | Root layout: ThemeProvider, CartProvider, Toaster |
| Create | `app/page.tsx` | Home page placeholder (replaced in Plan 2) |
| Create | `app/globals.css` | Import from styles/globals.css |
| Create | `components/layout/Navbar.tsx` | Sticky glass navbar |
| Create | `components/layout/MobileNav.tsx` | Bottom nav bar (mobile only) |

---

### Task 1: Upgrade dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Run upgrade command**

```bash
yarn add next@14 react@18 react-dom@18 framer-motion lucide-react next-themes react-hot-toast
yarn add -D typescript @types/react @types/react-dom @types/node
yarn remove use-local-storage-state
```

Expected output: success messages, no peer dependency errors for next@14.

- [ ] **Step 2: Verify next version**

```bash
node -e "console.log(require('./node_modules/next/package.json').version)"
```

Expected: `14.x.x`

---

### Task 2: TypeScript + Tailwind config

**Files:**
- Create: `tsconfig.json`
- Modify: `tailwind.config.js`
- Modify: `next.config.js`

- [ ] **Step 1: Create tsconfig.json**

Create `/Users/stutisoni/ecommerce/E-commerce/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Update tailwind.config.js**

Replace the full contents of `tailwind.config.js` with:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}
```

- [ ] **Step 3: Update next.config.js**

Replace contents of `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
}

module.exports = nextConfig
```

---

### Task 3: Global styles

**Files:**
- Modify: `styles/globals.css`

- [ ] **Step 1: Replace globals.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 239 84% 67%;
    --primary-foreground: 0 0% 100%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 239 84% 67%;
    --primary-foreground: 0 0% 100%;
  }

  * {
    @apply border-slate-200 dark:border-slate-800;
  }

  body {
    @apply bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50;
    font-family: 'Inter', system-ui, sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }
}

@layer utilities {
  .gradient-text {
    @apply bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent;
  }

  .glass {
    @apply bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50;
  }

  .gradient-brand {
    background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899);
  }
}
```

---

### Task 4: TypeScript types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Create types/index.ts**

```typescript
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'phones' | 'laptops' | 'headphones';
  picture: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  products: object;
  name: string;
  email: string;
  address: string;
  city: string;
  paid: 0 | 1;
  createdAt: string;
}
```

---

### Task 5: Utility functions

**Files:**
- Create: `lib/utils.ts`

- [ ] **Step 1: Create lib/utils.ts**

```typescript
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}
```

- [ ] **Step 2: Install clsx**

```bash
yarn add clsx
```

---

### Task 6: Cart hook

**Files:**
- Create: `hooks/useCart.ts`
- Create: `context/CartContext.tsx`

- [ ] **Step 1: Create hooks/useCart.ts**

```typescript
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
```

- [ ] **Step 2: Create context/CartContext.tsx**

```tsx
'use client';

import { createContext, useContext } from 'react';
import { useCart } from '@/hooks/useCart';

type CartContextType = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
}
```

---

### Task 7: Wishlist hook

**Files:**
- Create: `hooks/useWishlist.ts`

- [ ] **Step 1: Create hooks/useWishlist.ts**

```typescript
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
```

---

### Task 8: App Router root layout

**Files:**
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx` (placeholder)

- [ ] **Step 1: Create app/globals.css**

```css
@import '../styles/globals.css';
```

- [ ] **Step 2: Create app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'NovaBuy — The Future of Tech Shopping',
  description: 'Premium tech products. Phones, Laptops, Headphones.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--toast-bg, #1e293b)',
                  color: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid rgba(99,102,241,0.3)',
                },
              }}
            />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create app/page.tsx placeholder**

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold gradient-text">NovaBuy — coming soon</h1>
    </main>
  );
}
```

- [ ] **Step 4: Verify dev server starts without errors**

```bash
yarn dev
```

Expected: Server starts on port 3000, no TypeScript or module errors in terminal.

---

### Task 9: Navbar component

**Files:**
- Create: `components/layout/Navbar.tsx`

- [ ] **Step 1: Create components/layout/Navbar.tsx**

```tsx
'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ShoppingCart, Sun, Moon, Search, Menu, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCartContext } from '@/context/CartContext';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { cartCount } = useCartContext();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">NovaBuy</span>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          {mounted && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </motion.button>
          )}

          {/* Cart */}
          <Link href="/checkout">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-brand text-white text-xs flex items-center justify-center font-bold"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </motion.div>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass border-t border-slate-200/50 dark:border-slate-700/50 px-4 py-4 space-y-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm focus:outline-none"
              />
            </div>
            <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 font-medium hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/checkout" onClick={() => setMenuOpen(false)} className="block py-2 font-medium hover:text-indigo-600 transition-colors">Cart ({cartCount})</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

---

### Task 10: Mobile bottom nav

**Files:**
- Create: `components/layout/MobileNav.tsx`

- [ ] **Step 1: Create components/layout/MobileNav.tsx**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartContext } from '@/context/CartContext';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/checkout', icon: ShoppingCart, label: 'Cart' },
  { href: '/wishlist', icon: Heart, label: 'Saved' },
  { href: '/account', icon: User, label: 'Account' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { cartCount } = useCartContext();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-200/50 dark:border-slate-700/50 px-2 py-2 pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}>
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-colors ${
                  active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {href === '/checkout' && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full gradient-brand text-white text-xs flex items-center justify-center font-bold leading-none">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Add Navbar and MobileNav to app/layout.tsx**

Update the `<body>` section of `app/layout.tsx`:

```tsx
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';

// Inside <body>:
<body>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <CartProvider>
      <Navbar />
      <main className="pt-16 pb-20 md:pb-0">
        {children}
      </main>
      <MobileNav />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--toast-bg, #1e293b)',
            color: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid rgba(99,102,241,0.3)',
          },
        }}
      />
    </CartProvider>
  </ThemeProvider>
</body>
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:3000`. Expected:
- Navbar visible at top with NovaBuy logo, search, cart icon, dark mode toggle
- On mobile (resize browser < 768px): hamburger menu appears, bottom nav visible
- Dark mode toggle switches theme

---

**Plan 1 complete.** Foundation is ready.
