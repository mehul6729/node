import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/products"
          className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
        >
          <h2 className="text-lg font-semibold text-stone-900">Manage products</h2>
          <p className="mt-1 text-sm text-stone-500">View all products and add new ones</p>
        </Link>
        <Link
          to="/admin/orders"
          className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all"
        >
          <h2 className="text-lg font-semibold text-stone-900">Orders</h2>
          <p className="mt-1 text-sm text-stone-500">View and update order status</p>
        </Link>
      </div>
    </div>
  );
}
