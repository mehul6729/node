import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => {
        if (res.data?.success) setProducts(res.data.products || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const imgUrl = (p) => {
    const src = p?.images?.[0];
    if (!src) return null;
    return src.startsWith('http') ? src : `/${src.replace(/^\/+/, '')}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">All Products</h1>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="rounded-xl bg-stone-200 h-72 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-stone-500">
          No products available.
        </div>
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
                  <div className="h-full w-full flex items-center justify-center text-stone-400 text-4xl">?</div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-stone-900 truncate group-hover:text-amber-600">{p.title}</h3>
                <p className="text-xs text-stone-500 truncate">{p.brand}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-amber-600">₹{p.discountPrice ?? p.price}</span>
                  {p.discountPrice && (
                    <span className="text-sm text-stone-400 line-through">₹{p.price}</span>
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
