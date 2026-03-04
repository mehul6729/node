import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProductDetails } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getProductDetails(id)
      .then((res) => {
        if (res.data?.success) setProduct(res.data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

  const imgUrl = (src) => (src?.startsWith('http') ? src : src ? `/${src.replace(/^\/+/, '')}` : null);

  const handleAddToCart = async () => {
    if (!user) {
      setMessage('Please login to add to cart');
      return;
    }
    setAdding(true);
    setMessage('');
    const result = await addToCart(product._id, quantity);
    setAdding(false);
    if (result.success) setMessage('Added to cart!');
    else setMessage(result.message || 'Failed to add');
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
        <p className="text-stone-500">Product not found.</p>
        <Link to="/products" className="mt-4 inline-block text-amber-600 hover:underline">Back to products</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const mainImg = images[selectedImageIndex];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden aspect-square max-h-[480px]">
            {mainImg ? (
              <img
                src={imgUrl(mainImg)}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-stone-400 text-6xl">?</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === selectedImageIndex ? 'border-amber-500 ring-1 ring-amber-500' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <img
                    src={imgUrl(src)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-stone-500">{product.brand} · {product.category}</p>
          <h1 className="mt-1 text-2xl font-bold text-stone-900">{product.title}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold text-amber-600">₹{product.discountPrice ?? product.price}</span>
            {product.discountPrice && (
              <span className="text-stone-400 line-through">₹{product.price}</span>
            )}
          </div>
          <p className="mt-4 text-stone-600 leading-relaxed">{product.description}</p>
          <p className="mt-2 text-sm text-stone-500">Stock: {product.stock}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-stone-700">Qty</span>
              <input
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="w-20 rounded-lg border border-stone-300 px-3 py-2 text-center"
              />
            </label>
            {user ? (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={adding || product.stock < 1}
                className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600 inline-block"
              >
                Login to Add to Cart
              </Link>
            )}
          </div>
          {message && (
            <p className={`mt-3 text-sm ${message.includes('Added') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
