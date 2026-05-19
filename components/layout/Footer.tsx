import Link from 'next/link';
import { Zap, X, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NovaBuy</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              The future of tech shopping. Premium products, seamless experience.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: X, href: '#' },
                { icon: Globe, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }, idx) => (
                <a key={idx} href={href} className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Products', href: '/#products' },
                { label: 'Cart', href: '/checkout' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-slate-900 dark:text-slate-100">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>support@novabuy.in</li>
              <li>Mon – Sat, 9 AM – 6 PM IST</li>
              <li>Bangalore, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-400">
          © 2026 NovaBuy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
