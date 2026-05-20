'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  User, Mail, ShoppingBag, Heart, LogOut, ChevronRight,
  Package, Calendar, MapPin, Sparkles, Edit2
} from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

interface Order {
  _id: string;
  products: Record<string, number>;
  name: string;
  email: string;
  address: string;
  city: string;
  paid: number;
  createdAt: string;
}

const TABS = ['Overview', 'Orders', 'Wishlist'] as const;
type Tab = typeof TABS[number];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { wishlist } = useWishlist();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setOrdersLoading(true);
    fetch('/api/profile/orders')
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setOrdersLoading(false); })
      .catch(() => setOrdersLoading(false));
  }, [status]);

  useEffect(() => {
    if (!wishlist.length) { setWishlistProducts([]); return; }
    fetch(`/api/products?ids=${wishlist.join(',')}`)
      .then(r => r.json())
      .then(data => setWishlistProducts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [wishlist]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const initials = session.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '??';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-8 mb-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-black border-2 border-white/30 shrink-0">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black mb-1">{session.user?.name}</h1>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Mail className="w-4 h-4" />
              {session.user?.email}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-sm font-semibold backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-4 mt-8">
          {[
            { label: 'Orders', value: orders.length, icon: ShoppingBag },
            { label: 'Wishlist', value: wishlist.length, icon: Heart },
            { label: 'AI Searches', value: '∞', icon: Sparkles },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <Icon className="w-5 h-5 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-black">{value}</div>
              <div className="text-xs text-white/70 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8 w-fit">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'Overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-900 p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-indigo-500" /> Account Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Name</span>
                <span className="font-semibold">{session.user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold">{session.user?.email}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Member since</span>
                <span className="font-semibold">2026</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-900 p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-indigo-500" /> Recent Orders</h3>
            {ordersLoading ? (
              <div className="space-y-3">
                {[1,2].map(i => <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No orders yet</p>
                <Link href="/" className="text-indigo-500 text-sm font-semibold hover:underline mt-1 block">Start shopping</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map(order => (
                  <div key={order._id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div>
                      <p className="text-sm font-semibold">{formatPrice(order.paid)}</p>
                      <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${order.paid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'}`}>
                      {order.paid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                ))}
                {orders.length > 3 && (
                  <button onClick={() => setActiveTab('Orders')} className="text-indigo-500 text-sm font-semibold hover:underline flex items-center gap-1">
                    View all {orders.length} orders <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-900 p-6 sm:col-span-2">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Heart className="w-5 h-5 text-rose-500" /> Saved Items</h3>
            {wishlist.length === 0 ? (
              <div className="text-center py-6 text-slate-400">
                <Heart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No saved items yet</p>
                <Link href="/" className="text-indigo-500 text-sm font-semibold hover:underline mt-1 block">Browse products</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {wishlistProducts.slice(0, 4).map(p => (
                  <Link key={p._id} href={`/product/${p._id}`} className="group rounded-xl border border-slate-200/70 dark:border-slate-700/70 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-3">
                      <Image src={p.picture} alt={p.name} width={80} height={80} className="object-contain w-full h-full" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-semibold line-clamp-1">{p.name}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Orders tab */}
      {activeTab === 'Orders' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {ordersLoading ? (
            [1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
              <p className="text-sm mb-4">Looks like you haven&apos;t placed any orders.</p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-brand text-white font-semibold text-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            orders.map((order, i) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-900 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {order.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{order.city}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg gradient-text">{formatPrice(order.paid)}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${order.paid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'}`}>
                      {order.paid ? '✓ Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
                {order.address && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {order.address}, {order.city}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Wishlist tab */}
      {activeTab === 'Wishlist' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {wishlist.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-sm mb-4">Save items you love by tapping the heart icon.</p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-brand text-white font-semibold text-sm">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {wishlistProducts.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/product/${p._id}`} className="group block rounded-2xl border border-slate-200/70 dark:border-slate-700/70 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center p-4">
                      <Image src={p.picture} alt={p.name} width={120} height={120} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm line-clamp-1 mb-1">{p.name}</p>
                      <p className="font-black text-indigo-600 dark:text-indigo-400">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
