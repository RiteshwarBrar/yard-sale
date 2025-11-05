"use client";

import Image from "next/image";
import Link from "next/link";

export type Product = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number; // cents
  currency?: string; // defaults to USD
  badge?: string; // e.g., "New", "Sale"
};

type ProductsProps = {
  products: Product[];
  heading?: string;
  onAddToCart?: (product: Product) => void;
};

function formatPrice(
  amountCents: number,
  currency: string = "USD",
  locale: string = "en-US"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountCents / 100);
}

export default function Products({
  products,
  heading = "Products",
  onAddToCart,
}: ProductsProps) {
  return (
    <section aria-labelledby="products-heading" className="w-full">
      <div className="mb-4 flex items-end justify-between">
        <h2 id="products-heading" className="text-xl font-semibold">
          {heading}
        </h2>
        <p className="text-sm text-muted-foreground">
          {products.length} item{products.length === 1 ? "" : "s"}
        </p>
      </div>

      <ul
        className="
          grid list-none gap-4 p-0
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        "
        aria-label="Product results"
      >
        {products.map((p) => (
          <li key={p.id} className="min-w-0">
            <article
              className="
                group relative h-full overflow-hidden rounded-lg border bg-white
                shadow-sm transition-shadow hover:shadow-md focus-within:shadow-md
              "
              aria-labelledby={`product-${p.id}-title`}
            >
              <Link
                href={`/products/${p.slug}`}
                className="absolute inset-0"
                aria-label={`View ${p.name}`}
              />
              <div className="relative aspect-[4/5] w-full bg-gray-50">
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                {p.badge ? (
                  <span
                    className="
                      pointer-events-none absolute left-2 top-2 rounded bg-black/80
                      px-2 py-0.5 text-xs font-medium text-white
                    "
                  >
                    {p.badge}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col gap-1 p-3">
                <h3
                  id={`product-${p.id}-title`}
                  className="line-clamp-2 text-sm font-medium"
                >
                  {p.name}
                </h3>
                <p className="text-sm font-semibold">
                  {formatPrice(p.price, p.currency ?? "USD")}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="
                      z-10 inline-flex items-center justify-center rounded-md border px-3 py-1.5
                      text-sm font-medium transition-colors
                      hover:bg-gray-50 active:scale-[0.99] focus:outline-none focus-visible:ring-2
                      focus-visible:ring-black/20
                    "
                    onClick={(e) => {
                      e.preventDefault(); // keep Link from navigating
                      onAddToCart?.(p);
                    }}
                    aria-label={`Add ${p.name} to cart`}
                  >
                    Add to cart
                  </button>
                  <Link
                    href={`/products/${p.slug}`}
                    className="
                      z-10 inline-flex items-center justify-center rounded-md bg-black px-3 py-1.5
                      text-sm font-medium text-white transition-colors hover:bg-black/90 focus:outline-none
                      focus-visible:ring-2 focus-visible:ring-black/20
                    "
                    aria-label={`View details for ${p.name}`}
                  >
                    View
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
