import { useEffect, useState } from 'react';
import { getAdminOrders, updateOrderStatus } from '../../api';

const STATUS_OPTIONS = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUS_OPTIONS = ['Pending', 'Paid', 'Failed'];

function imgUrl(src) {
  if (!src) return null;
  return src.startsWith('http') ? src : `/${src.replace(/^\/+/, '')}`;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = () => {
    getAdminOrders()
      .then((res) => {
        if (res.data?.success) setOrders(res.data.orders || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (orderId, orderStatus, paymentStatus) => {
    setUpdating(orderId);
    try {
      const res = await updateOrderStatus({
        order_id: orderId,
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
      });
      if (res.data?.success) load();
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-stone-500">
        No orders yet.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="rounded-xl border border-stone-200 bg-white overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 bg-stone-50 px-4 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm text-stone-600">{order._id}</span>
                <span className="text-sm text-stone-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value, null)}
                  disabled={updating === order._id}
                  className="rounded-lg border border-stone-300 px-2 py-1 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => handleStatusChange(order._id, null, e.target.value)}
                  disabled={updating === order._id}
                  className="rounded-lg border border-stone-300 px-2 py-1 text-sm"
                >
                  {PAYMENT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            {order.user && typeof order.user === 'object' && (
              <div className="px-4 py-2 bg-amber-50/50 border-b border-stone-100">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Customer</p>
                <p className="text-sm font-medium text-stone-800">{order.user.name}</p>
                {order.user.email && (
                  <p className="text-sm text-stone-600">{order.user.email}</p>
                )}
                {order.user.phone && (
                  <p className="text-sm text-stone-600">Phone: {order.user.phone}</p>
                )}
              </div>
            )}
            <ul className="divide-y divide-stone-100">
              {order.items?.map((item, i) => (
                <li key={i} className="flex gap-4 px-4 py-3">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                    {item.image ? (
                      <img src={imgUrl(item.image)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-stone-400">—</div>
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
