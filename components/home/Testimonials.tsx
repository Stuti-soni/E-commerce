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
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
