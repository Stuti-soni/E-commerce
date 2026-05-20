'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

function PayContent() {
  const router = useRouter();
  const params = useSearchParams();
  const order_id = params?.get('order_id');
  const amount = params?.get('amount');
  const name = params?.get('name') ?? '';
  const email = params?.get('email') ?? '';
  const db_order_id = params?.get('db_order_id') ?? '';

  useEffect(() => {
    if (!order_id) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        name: 'NovaBuy',
        description: 'Premium Tech Shopping',
        order_id,
        prefill: { name, email },
        theme: { color: '#6366f1' },
        handler: function (response: any) {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = '/api/webhook';
          const fields: Record<string, string> = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            db_order_id,
          };
          for (const [key, value] of Object.entries(fields)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
        },
        modal: {
          ondismiss: () => router.push('/?canceled=true'),
        },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };
    document.body.appendChild(script);
  }, [order_id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center"
      >
        <Zap className="w-8 h-8 text-white" />
      </motion.div>
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Opening Secure Checkout</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Powered by Razorpay · 256-bit SSL</p>
      </div>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense>
      <PayContent />
    </Suspense>
  );
}
