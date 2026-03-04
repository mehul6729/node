import { useEffect, useState } from 'react';
import { getMyOrders } from '../api';

const STATUS_COLORS = {
  Processing: 'bg-amber-100 text-amber-800',
  Shipped: 'bg-blue-100 text-blue-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

function imgUrl(src) {
  if (!src) return null;
  return src.startsWith('http') ? src : `/${src.replace(/^\/+/, '')}`;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        if (res.data?.success) setOrders(res.data.orders || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
        <h2 className="text-xl font-semibold text-stone-800">No orders yet</h2>
        <p className="mt-2 text-stone-500">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Order history</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-xl border border-stone-200 bg-white overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 bg-stone-50 px-4 py-3">
              <span className="font-mono text-sm text-stone-600">{order._id}</span>
              <span className="text-sm text-stone-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  STATUS_COLORS[order.orderStatus] || 'bg-stone-100 text-stone-700'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <ul className="divide-y divide-stone-100">
              {order.items?.map((item, i) => (
                <li key={i} className="flex gap-4 px-4 py-3">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {item.image ? (
                      <img
                        src={imgUrl(item.image)}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-stone-400">?</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-900 truncate">{item.title}</p>
                    <p className="text-sm text-stone-500">Qty: {item.quantity} × ₹{item.price}</p>
                  </div>
                  <p className="font-semibold text-stone-800">₹{item.quantity * item.price}</p>
                </li>
              ))}
            </ul>
            <div className="border-t border-stone-200 px-4 py-3 text-right font-semibold text-stone-900">
              Total: ₹{order.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
