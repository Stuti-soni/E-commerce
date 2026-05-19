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
          We obsess over the details so you don&apos;t have to.
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
