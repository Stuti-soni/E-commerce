'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Smartphone, Laptop, Headphones, Shirt, Home, ArrowRight } from 'lucide-react';
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
  {
    name: 'Clothes',
    slug: 'clothes',
    description: 'Stylish everyday essentials',
    icon: Shirt,
    gradient: 'from-rose-500 to-pink-600',
    bg: 'from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40',
  },
  {
    name: 'Household',
    slug: 'household',
    description: 'Smart gadgets for your home',
    icon: Home,
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40',
  },
];

export default function CategorySection() {
  return (
    <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <AnimatedSection className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Shop by Category</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Find exactly what you&apos;re looking for across our curated collections.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <AnimatedSection key={cat.slug} delay={i * 0.1}>
              <Link href="#products">
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
