import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import SuccessHandler from '@/components/shared/SuccessHandler';
import AIChatAssistant from '@/components/shared/AIChatAssistant';
import SessionWrapper from '@/components/shared/SessionWrapper';
import './globals.css';

export const metadata: Metadata = {
  title: 'NovaBuy — The Future of Tech Shopping',
  description: 'Premium tech products. Phones, Laptops, Headphones.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionWrapper>
          <CartProvider>
            <Navbar />
            <main className="pt-16 pb-20 md:pb-0">
              {children}
            </main>
            <Suspense>
              <SuccessHandler />
            </Suspense>
            <AIChatAssistant />
            <MobileNav />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1e293b',
                  color: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid rgba(99,102,241,0.3)',
                },
              }}
            />
          </CartProvider>
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
