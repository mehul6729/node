import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    getProducts()
      .then((res) => {
        if (res.data?.success) setProducts(res.data.products || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (productId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(productId);
    try {
      const res = await deleteProduct(productId);
      if (res.data?.success) load();
      else alert(res.data?.message || 'Delete failed');
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const imgUrl = (p) => {
    const src = p?.images?.[0];
    return src?.startsWith('http') ? src : src ? `/${src.replace(/^\/+/, '')}` : null;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Manage products</h1>
        <Link
          to="/admin/products/new"
          className="rounded-xl bg-amber-500 px-4 py-2 font-semibold text-white hover:bg-amber-600"
        >
          Add product
        </Link>
      </div>
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-stone-500">
          No products. <Link to="/admin/products/new" className="text-amber-600 hover:underline">Add one</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="px-4 py-3 text-sm font-semibold text-stone-700">Image</th>
                <th className="px-4 py-3 text-sm font-semibold text-stone-700">Title</th>
                <th className="px-4 py-3 text-sm font-semibold text-stone-700">Price</th>
                <th className="px-4 py-3 text-sm font-semibold text-stone-700">Stock</th>
                <th className="px-4 py-3 text-sm font-semibold text-stone-700">Category</th>
                <th className="px-4 py-3 text-sm font-semibold text-stone-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-stone-100">
                      {imgUrl(p) ? (
                        <img src={imgUrl(p)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-stone-400">—</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-900">{p.title}</td>
                  <td className="px-4 py-3 text-stone-600">₹{p.discountPrice ?? p.price}</td>
                  <td className="px-4 py-3 text-stone-600">{p.stock}</td>
                  <td className="px-4 py-3 text-stone-600">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="rounded-lg border border-stone-300 px-2 py-1 text-sm font-medium text-stone-700 hover:bg-stone-100"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p._id, p.title)}
                        disabled={deletingId === p._id}
                        className="rounded-lg border border-red-200 px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === p._id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
