import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

function imgUrl(p) {
  const src = p?.images?.[0];
  if (!src) return null;
  return src.startsWith('http') ? src : `/${src.replace(/^\/+/, '')}`;
}

export default function Cart() {
  const { cart, setCart, refreshCart } = useCart();
  const [updating, setUpdating] = useState(false);

  const updateQty = async (index, newQty) => {
    if (newQty < 1) return;
    const items = cart.map((item, i) => ({
      product: item.product?._id || item.product,
      quantity: i === index ? newQty : item.quantity,
    }));
    setUpdating(true);
    await setCart(items);
    setUpdating(false);
  };

  const removeItem = async (index) => {
    const items = cart.filter((_, i) => i !== index).map((item) => ({
      product: item.product?._id || item.product,
      quantity: item.quantity,
    }));
    if (items.length === 0) {
      setUpdating(true);
      await setCart([]);
      setUpdating(false);
      return;
    }
    setUpdating(true);
    await setCart(items);
    setUpdating(false);
  };

  const subtotal = cart.reduce((sum, item) => {
    const p = item.product;
    const price = p?.discountPrice ?? p?.price ?? 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  if (!cart.length) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
        <h2 className="text-xl font-semibold text-stone-800">Your cart is empty</h2>
        <Link to="/products" className="mt-4 inline-block text-amber-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => {
            const p = item.product;
            if (!p) return null;
            const price = p.discountPrice ?? p.price;
            const src = imgUrl(p);
            return (
              <div
                key={`${p._id}-${index}`}
                className="flex gap-4 rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {src ? (
                    <img src={src} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-stone-400">?</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${p._id}`} className="font-medium text-stone-900 hover:text-amber-600 truncate block">
                    {p.title}
                  </Link>
                  <p className="text-amber-600 font-semibold">₹{price}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQty(index, (item.quantity || 1) - 1)}
                      disabled={updating || item.quantity <= 1}
                      className="h-8 w-8 rounded border border-stone-300 text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(index, (item.quantity || 1) + 1)}
                      disabled={updating || (p.stock != null && item.quantity >= p.stock)}
                      className="h-8 w-8 rounded border border-stone-300 text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={updating}
                      className="ml-2 text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold text-stone-800">
                  ₹{price * (item.quantity || 0)}
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <div className="sticky top-24 rounded-xl border border-stone-200 bg-white p-6">
            <h3 className="font-semibold text-stone-800">Order summary</h3>
            <p className="mt-2 text-stone-600">Subtotal: <span className="font-semibold">₹{subtotal}</span></p>
            <Link
              to="/checkout"
              className="mt-4 block w-full rounded-xl bg-amber-500 py-3 text-center font-semibold text-white hover:bg-amber-600 transition-colors"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
