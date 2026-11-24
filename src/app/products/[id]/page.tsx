import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { productsService } from "@/services/products.service";
import { isNotFound } from "@/services/api";
import type { Product } from "@/types";
import ProductGallery from "@/components/products/ProductGallery";
import ProductPurchase from "@/components/products/ProductPurchase";
import ProductReviews from "@/components/products/ProductReviews";
import ProductGrid from "@/components/products/ProductGrid";
import Rating from "@/components/ui/Rating";
import { ErrorState } from "@/components/ui/EmptyState";
import { discountPercent, formatPrice } from "@/utils/format";
import { getErrorMessage } from "@/services/api";

type Props = { params: { id: string } };

async function load(id: string): Promise<Product | null> {
  try {
    return await productsService.get(id);
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const p = await productsService.get(params.id);
    return { title: p.title, description: p.description?.slice(0, 155) };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: Props) {
  let product: Product | null;
  try {
    product = await load(params.id);
  } catch (e) {
    return <div className="container-fc py-16"><ErrorState message={getErrorMessage(e, "We couldn't load this product.")} /></div>;
  }
  if (!product) notFound();

  const hasDiscount = !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const price = hasDiscount ? (product.priceAfterDiscount as number) : product.price;
  const off = discountPercent(product.price, product.priceAfterDiscount);
  const images = [product.imageCover, ...(product.images ?? []).filter((i) => i !== product.imageCover)];

  let related: Product[] = [];
  try {
    const res = await productsService.list({ category: product.category._id, limit: 8 });
    related = res.data.filter((p) => p._id !== product.id && p._id !== product._id).slice(0, 4);
  } catch {
    related = [];
  }

  return (
    <div className="container-fc py-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary-600">Home</Link> / <Link href="/products" className="hover:text-primary-600">Shop</Link> /{" "}
        <Link href={`/categories/${product.category._id}`} className="hover:text-primary-600">{product.category.name}</Link>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={images} title={product.title} />
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link href={`/categories/${product.category._id}`} className="rounded-full bg-primary-50 px-3 py-1 font-medium text-primary-700 hover:bg-primary-100">{product.category.name}</Link>
            {product.brand && <Link href={`/brands/${product.brand._id}`} className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700 hover:bg-gray-200">{product.brand.name}</Link>}
          </div>
          <h1 className="mt-4 text-2xl font-extrabold leading-snug sm:text-3xl">{product.title}</h1>
          <div className="mt-3 flex items-center gap-4"><Rating value={product.ratingsAverage} count={product.ratingsQuantity} size="md" />{product.sold ? <span className="text-sm text-gray-500">{product.sold} sold</span> : null}</div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-primary-700">{formatPrice(price)}</span>
            {hasDiscount && (<>
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
              <span className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">Save {off}%</span>
            </>)}
          </div>

          {product.description && <p className="mt-5 leading-relaxed text-gray-600">{product.description}</p>}

          <div className="mt-6 border-t border-gray-100 pt-6"><ProductPurchase productId={product._id} stock={product.quantity} /></div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl bg-gray-50 p-5 text-sm">
            <dt className="text-gray-500">Category</dt><dd className="font-medium">{product.category.name}</dd>
            {product.subcategory?.[0] && (<><dt className="text-gray-500">Subcategory</dt><dd className="font-medium">{product.subcategory.map((s) => s.name).join(", ")}</dd></>)}
            {product.brand && (<><dt className="text-gray-500">Brand</dt><dd className="font-medium">{product.brand.name}</dd></>)}
            <dt className="text-gray-500">Availability</dt><dd className="font-medium">{product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}</dd>
          </dl>
        </div>
      </div>

      <div className="mt-16 max-w-3xl"><ProductReviews productId={product._id} /></div>

      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-title">
          <h2 id="related-title" className="mb-6 text-2xl font-bold">You may also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
