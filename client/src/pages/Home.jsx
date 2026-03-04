import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => {
        if (res.data?.success)
          setProducts(res.data.products?.slice(0, 8) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const imgUrl = (p) => {
    const src = p?.images?.[0];
    if (!src) return null;
    return src.startsWith("http") ? src : `/${src.replace(/^\/+/, "")}`;
  };

  return (
    <div>
      <section className="mb-16 rounded-2xl  from-amber-50 to-stone-100 p-8 sm:p-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Welcome to Your Store
        </h1>
        <p className="mt-3 text-stone-600 max-w-xl mx-auto">
          Discover quality products at great prices. Shop with confidence.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-amber-600 transition-colors"
        >
          Shop All Products
        </Link>
      </section>

      <h2 className="text-xl font-semibold text-stone-800 mb-6">
        Featured Products
      </h2>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-stone-200 h-64 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-stone-500 py-12 text-center">
          No products yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="group rounded-xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-stone-100 overflow-hidden">
                {imgUrl(p) ? (
                  <img
                    src={imgUrl(p)}
                    alt={p.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-stone-400 text-4xl">
                    ?
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-stone-900 truncate group-hover:text-amber-600">
                  {p.title}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-amber-600">
                    ₹{p.discountPrice ?? p.price}
                  </span>
                  {p.discountPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      ₹{p.price}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
