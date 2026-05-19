import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/shared/AnimatedSection';
import { Product } from '@/types';

interface Props { products: Product[]; }

export default function RelatedProducts({ products }: Props) {
  return (
    <AnimatedSection className="mt-16">
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {products.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </AnimatedSection>
  );
}
