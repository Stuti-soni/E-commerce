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
    toast.success("You're subscribed! Welcome to NovaBuy.", { icon: '🎉' });
    setEmail('');
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="max-w-3xl mx-auto rounded-3xl p-12 text-center text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)' }}>
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
