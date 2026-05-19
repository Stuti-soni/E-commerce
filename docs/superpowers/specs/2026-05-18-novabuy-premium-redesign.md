# NovaBuy — Premium UI Redesign Spec
**Date:** 2026-05-18  
**Status:** Approved

---

## Overview

Transform the existing Next.js 12 Pages Router e-commerce app into a premium, production-ready storefront called **NovaBuy** using Next.js 14 App Router + TypeScript, Framer Motion, Lucide Icons, and next-themes. All existing API routes (`pages/api/`) remain untouched. MongoDB models and Razorpay payment flow are preserved.

---

## Architecture

### Folder Structure

```
app/
  layout.tsx                  ← root layout: ThemeProvider, CartProvider, Toaster
  page.tsx                    ← home: Hero + Categories + ProductGrid + WhyChooseUs + Testimonials + Newsletter
  checkout/page.tsx           ← checkout page
  pay/page.tsx                ← Razorpay redirect page
  product/[id]/page.tsx       ← product detail page

components/
  layout/
    Navbar.tsx                ← sticky glass navbar
    Footer.tsx                ← multi-column footer
    MobileNav.tsx             ← bottom nav bar (mobile only)
  home/
    Hero.tsx                  ← animated hero section
    CategorySection.tsx       ← 3 category cards
    ProductGrid.tsx           ← product listing with search + filter tabs
    WhyChooseUs.tsx           ← 4 feature cards
    Testimonials.tsx          ← 3 review cards
    Newsletter.tsx            ← email subscription section
  product/
    ProductCard.tsx           ← card used in grid and related products
    ProductDetail.tsx         ← full detail layout
    RelatedProducts.tsx       ← grid of other products
  cart/
    CartDrawer.tsx            ← slide-in cart panel (optional enhancement)
    CartItem.tsx              ← single cart row
    EmptyCart.tsx             ← empty state UI
  shared/
    AnimatedSection.tsx       ← scroll-triggered fade-in wrapper
    LoadingSkeleton.tsx       ← shimmer skeleton cards
    Toast.tsx                 ← wraps react-hot-toast

lib/
  mongoose.ts                 ← unchanged
  utils.ts                    ← formatPrice, cn() helper

models/
  Product.ts                  ← unchanged (converted to .ts)
  Order.ts                    ← unchanged (converted to .ts)

types/
  index.ts                    ← Product, Order, CartItem interfaces

pages/
  api/                        ← ALL existing routes unchanged
    checkout.js
    products.js
    webhook.js
```

### New Dependencies
```
framer-motion
lucide-react
next-themes
react-hot-toast
```

### Removed Dependencies
- `use-local-storage-state` (replaced with custom hook using localStorage directly)

> Note: `micro` is kept — it is still used by `pages/api/webhook.js` which is untouched.

---

## Color System

| Token | Light | Dark |
|---|---|---|
| Background | `white` | `slate-950` |
| Surface | `slate-50` | `slate-900` |
| Border | `slate-200` | `slate-800` |
| Primary | `indigo-600` | `indigo-400` |
| Accent | `purple-500` | `purple-400` |
| Text primary | `slate-900` | `slate-50` |
| Text muted | `slate-500` | `slate-400` |

**Hero gradient:** `from-indigo-600 via-purple-600 to-pink-500`  
**Glass card:** `bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/50 dark:border-slate-700/50`

---

## Components

### Navbar
- Sticky, `bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl`
- Left: NovaBuy logo (gradient text `from-indigo-600 to-purple-600`)
- Center (desktop): search input, expands on focus with smooth transition
- Right: dark/light toggle (Lucide `Sun`/`Moon`), cart icon with animated count badge
- Mobile: hamburger opens full-screen menu overlay
- Height: 64px desktop / 56px mobile

### Hero Section
- Full viewport height on desktop, 80vh on mobile
- Background: radial gradient + 2 animated glow orbs (blurred circles, `indigo` and `purple`)
- Left: headline `"The Future of\nTech Shopping"` (large, bold, gradient text clip), subheadline, two buttons: "Shop Now" (filled gradient) + "View Deals" (ghost)
- Right: floating product image (Framer Motion `y` oscillation `[0, -20, 0]` over 3s loop)
- Scroll indicator arrow at bottom

### Category Section
- Heading: "Shop by Category"
- 3 cards side by side (responsive: stack on mobile)
- Each card: gradient icon background, category name, "Explore →" link
- Hover: `scale(1.04)` + shadow lift

### ProductGrid
- Heading: "Featured Products"  
- Filter tabs: All | Phones | Laptops | Headphones (animated underline indicator)
- Grid: 2 columns mobile, 3 desktop
- Each ProductCard: image with zoom on hover, name, description (1 line), price, star rating (static, seeded per product), wishlist heart toggle, "Add to Cart" button with toast on click
- Clicking card body navigates to `/product/[id]`

### ProductCard
- `rounded-2xl` card with glass background
- Image container: `aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700`
- Image: `object-contain p-6`, hover `scale(1.08)` transition
- Wishlist: heart icon top-right, fills on toggle, persisted in localStorage
- Price: bold, indigo color
- Add to cart: gradient button, Framer Motion `scale(0.95)` on press, shows toast

### Product Detail Page (`/product/[id]`)
- Fetches product by ID from MongoDB via server component
- Left: large product image in glass card
- Right: breadcrumb, name, star rating, price (large), description, specs list (hardcoded per category), quantity selector (+/−), "Add to Cart" + "Buy Now" buttons
- "Buy Now" adds to cart then navigates to `/checkout`
- Related products: grid of 3 products from same category at bottom
- Mobile: image on top, details below, sticky bottom bar with "Add to Cart"

### Why Choose Us
- 4 cards: Fast Delivery (Zap icon), Secure Payments (Shield icon), Premium Quality (Star icon), 1-Year Warranty (Award icon)
- Fade-in stagger on scroll using `AnimatedSection`

### Testimonials
- 3 static reviews (hardcoded, realistic content)
- Each: avatar initials circle (gradient bg), name, role, star rating, quote
- Horizontal scroll on mobile, grid on desktop

### Newsletter
- Centered, gradient background section
- Headline + subheadline, email input + "Subscribe" button
- No backend wiring — shows toast on submit

### Footer
- 3 columns: Brand (logo + tagline), Quick Links (Home, Products, Checkout), Contact (email, social icons)
- Bottom bar: © 2026 NovaBuy
- Social icons: Twitter, Instagram, GitHub (Lucide)

### MobileNav
- Fixed bottom bar, visible only on mobile (`md:hidden`)
- 4 icons: Home, Search (opens search overlay), Cart (with badge), User
- Active state: indigo color + label

---

## Animations

| Element | Animation |
|---|---|
| Hero product image | `y: [0, -20, 0]`, 3s loop, `ease: "easeInOut"` |
| Glow orbs | `scale: [1, 1.2, 1]`, 4s loop, offset phases |
| Section entry | `opacity: 0→1, y: 20→0`, triggered by `whileInView`, `once: true` |
| ProductCard hover | `scale: 1.03`, shadow transition |
| Button press | `whileTap: {scale: 0.96}` |
| Cart badge count change | `scale: [1, 1.4, 1]` keyframe |
| Category card hover | `scale: 1.04, y: -4` |
| Filter tab indicator | `layoutId` shared animation |
| Page transition | `opacity: 0→1` on mount |

---

## Cart State

Replace `use-local-storage-state` with a custom `useCart` hook using `localStorage` directly, compatible with React 18 + App Router hydration. CartProvider wraps `app/layout.tsx`. Cart state: `string[]` of product IDs (same structure as before — no breaking change to checkout API).

---

## Dark Mode

`next-themes` with `ThemeProvider` in root layout, `attribute="class"`. `tailwind.config.ts` sets `darkMode: "class"`. Theme persisted in localStorage. Toggle in Navbar.

---

## Data Flow

- Home page: `async` server component, fetches products from MongoDB directly (no API call needed in App Router)
- Product detail: `async` server component, fetches single product + related products
- Cart: client-side only, localStorage
- Checkout: client component, same POST to `/api/checkout`
- Pay: client component, same Razorpay JS SDK flow

---

## TypeScript Types

```typescript
// types/index.ts
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

## What Does NOT Change

- `pages/api/checkout.js` — untouched
- `pages/api/products.js` — untouched  
- `pages/api/webhook.js` — untouched
- `lib/mongoose.js` → renamed to `lib/mongoose.ts`, logic unchanged
- MongoDB connection, Razorpay keys, `.env` — untouched
- Product images in `public/products/` — untouched
- Seed script — untouched

---

## Out of Scope (Phase 2 / Phase 3)

- User authentication / profiles
- Real product reviews backend
- Real newsletter backend
- Admin dashboard
- Filtering by price range
- Order history page
