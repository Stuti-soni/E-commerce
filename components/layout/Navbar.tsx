'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ShoppingCart, Sun, Moon, Search, Menu, X, Zap, LogIn, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useCartContext } from '@/context/CartContext';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { cartCount } = useCartContext();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
        scrolled ? 'glass shadow-lg shadow-black/5' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">NovaBuy</span>
        </Link>

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

        <div className="flex items-center gap-2">
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

          {mounted && (
            session ? (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <div className="w-6 h-6 rounded-full gradient-brand flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {session.user?.name}
                  </span>
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-brand text-white text-sm font-semibold shadow-sm hover:shadow-indigo-500/30 transition-shadow">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )
          )}

          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

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
            {session ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="block py-2 font-medium hover:text-indigo-600 transition-colors">My Profile</Link>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left py-2 font-medium text-rose-500 hover:text-rose-600 transition-colors">
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block py-2 font-medium text-indigo-600 hover:text-indigo-700 transition-colors">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
