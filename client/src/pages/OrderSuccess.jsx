import { useParams, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto text-2xl">
        ✓
      </div>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">Order placed successfully</h1>
      <p className="mt-2 text-stone-600">Order ID: <span className="font-mono text-sm">{orderId}</span></p>
      <div className="mt-8 flex gap-4 justify-center">
        <Link
          to="/orders"
          className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
        >
          View orders
        </Link>
        <Link
          to="/products"
          className="rounded-xl border border-stone-300 px-6 py-3 font-semibold text-stone-700 hover:bg-stone-50"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
