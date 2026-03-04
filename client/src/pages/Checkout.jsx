import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api';

const PAYMENT_OPTIONS = [
  { value: 'COD', label: 'Cash on Delivery' },
  { value: 'CARD', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
];

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const items = cart.map((item) => ({
    product: item.product?._id || item.product,
    quantity: item.quantity || 1,
  }));

  const subtotal = cart.reduce((sum, item) => {
    const p = item.product;
    const price = p?.discountPrice ?? p?.price ?? 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Cart is empty');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await createOrder({ items, paymentMethod });
      if (res.data?.success && res.data?.order) {
        await refreshCart();
        navigate(`/order-success/${res.data.order._id}`);
        return;
      }
      setError(res.data?.message || 'Failed to place order');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0 && !submitting) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
        <p className="text-stone-500">Your cart is empty. Add items before checkout.</p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mt-4 text-amber-600 hover:underline"
        >
          Browse products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Payment method</label>
          <div className="space-y-2">
            {PAYMENT_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={() => setPaymentMethod(opt.value)}
                  className="text-amber-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p className="text-stone-600">Total: <span className="font-bold text-lg text-stone-900">₹{subtotal}</span></p>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting || items.length === 0}
          className="w-full rounded-xl bg-amber-500 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </div>
  );
}
