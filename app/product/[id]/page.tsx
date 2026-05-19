export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { initMongoose } from '@/lib/mongoose';
import ProductModel from '@/models/Product';
import { Product } from '@/types';
import ProductDetail from '@/components/product/ProductDetail';
import RelatedProducts from '@/components/product/RelatedProducts';
import AIRecommendations from '@/components/product/AIRecommendations';

interface Props {
  params: { id: string };
}

async function getProduct(id: string): Promise<Product | null> {
  await initMongoose();
  try {
    const product = await ProductModel.findById(id).lean().exec();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch {
    return null;
  }
}

async function getRelated(category: string, excludeId: string): Promise<Product[]> {
  const products = await ProductModel.find({ category, _id: { $ne: excludeId } }).limit(3).lean().exec();
  return JSON.parse(JSON.stringify(products));
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const related = await getRelated(product.category, product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProductDetail product={product} />
      {related.length > 0 && <RelatedProducts products={related} />}
      <AIRecommendations productId={product._id} />
    </div>
  );
}
