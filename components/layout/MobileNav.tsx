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
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { cartCount } = useCartContext();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-slate-200/50 dark:border-slate-700/50 px-2 py-2">
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
