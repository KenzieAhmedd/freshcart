import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { discountPercent, formatPrice } from "@/utils/format";
import Rating from "@/components/ui/Rating";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const hasDiscount = !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const shown = hasDiscount ? (product.priceAfterDiscount as number) : product.price;
  const off = discountPercent(product.price, product.priceAfterDiscount);
  const soldOut = product.quantity < 1;

  return (
    <article className="group card flex flex-col overflow-hidden transition-shadow hover:shadow-pop">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/products/${product._id}`} aria-label={product.title}>
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            priority={priority}
            sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 46vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {off > 0 && <span className="absolute left-3 top-3 rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">-{off}%</span>}
        {soldOut && <span className="absolute bottom-3 left-3 rounded-md bg-gray-900/80 px-2 py-0.5 text-xs font-semibold text-white">Out of stock</span>}
        <div className="absolute right-3 top-3"><WishlistButton productId={product._id} /></div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/categories/${product.category._id}`} className="text-xs font-medium text-gray-500 hover:text-primary-600">
          {product.category.name}
        </Link>
        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900">
          <Link href={`/products/${product._id}`} className="hover:text-primary-600">{product.title}</Link>
        </h3>
        <div className="mt-2"><Rating value={product.ratingsAverage} count={product.ratingsQuantity} /></div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-base font-bold text-gray-900">{formatPrice(shown)}</p>
            {hasDiscount && <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>}
          </div>
          <AddToCartButton productId={product._id} outOfStock={soldOut} compact />
        </div>
      </div>
    </article>
  );
}
