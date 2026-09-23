import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductDetail from '@/components/ProductDetail';
import { getProductById } from '@/lib/products';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main>
        <ProductDetail product={product} />
      </main>
    </>
  );
}
