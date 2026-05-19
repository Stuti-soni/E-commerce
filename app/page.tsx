export const dynamic = 'force-dynamic';

import { initMongoose } from '@/lib/mongoose';
import ProductModel from '@/models/Product';
import Hero from '@/components/home/Hero';
import CategorySection from '@/components/home/CategorySection';
import ProductGrid from '@/components/home/ProductGrid';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import Footer from '@/components/layout/Footer';
import { Product } from '@/types';

async function getProducts(): Promise<Product[]> {
  await initMongoose();
  const products = await ProductModel.find().lean().exec();
  return JSON.parse(JSON.stringify(products));
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <CategorySection />
      <ProductGrid products={products} />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}
