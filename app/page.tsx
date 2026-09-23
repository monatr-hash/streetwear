import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import LookbookGrid from '@/components/LookbookGrid';
import { getProducts } from '@/lib/products';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <section id="collection" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-bold uppercase tracking-tight text-zinc-50 sm:text-4xl">
              Drop 01
            </h2>
            <p className="text-sm text-zinc-500">{products.length} pieces</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>

        <LookbookGrid />
      </main>
    </>
  );
}
