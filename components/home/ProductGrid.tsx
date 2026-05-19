'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { Product } from '@/types';

const TABS = ['All', 'Phones', 'Laptops', 'Headphones', 'Clothes', 'Household'] as const;
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
