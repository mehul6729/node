import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetails, updateProduct, uploadProductImage } from '../../api';

const INITIAL = {
  title: '',
  description: '',
  price: '',
  discountPrice: '',
  category: '',
  brand: '',
  stock: '',
};

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [imagePaths, setImagePaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProductDetails(id)
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const p = res.data.data;
          setForm({
            title: p.title || '',
            description: p.description || '',
            price: p.price ?? '',
            discountPrice: p.discountPrice ?? '',
            category: p.category || '',
            brand: p.brand || '',
            stock: p.stock ?? '',
          });
          setImagePaths(Array.isArray(p.images) ? [...p.images] : []);
        }
      })
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadProductImage(formData);
      if (res.data?.success && res.data?.data) {
        setImagePaths((prev) => [...prev, res.data.data]);
      } else {
        setError(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImagePaths((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imagePaths.length === 0) {
      setError('Keep at least one image');
      return;
    }
    const price = Number(form.price);
    const discountPrice = form.discountPrice ? Number(form.discountPrice) : undefined;
    if (!form.title || !price || !form.category || !form.brand) {
      setError('Fill required fields: title, price, category, brand');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await updateProduct({
        _id: id,
        ...form,
        price,
        discountPrice: discountPrice || undefined,
        stock: Number(form.stock) || 0,
        images: imagePaths,
      });
      if (res.data?.success) {
        navigate('/admin/products');
        return;
      }
      setError(res.data?.message || 'Failed to update product');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Edit product</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Price (₹) *</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Discount price (₹)</label>
            <input
              name="discountPrice"
              type="number"
              min="0"
              step="0.01"
              value={form.discountPrice}
              onChange={handleChange}
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Category *</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Brand *</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Images * (at least one)</label>
          <div className="flex flex-wrap gap-2">
            {imagePaths.map((path, i) => (
              <div key={i} className="relative">
                <img
                  src={path.startsWith('http') ? path : `/${path.replace(/^\/+/, '')}`}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover border border-stone-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs leading-none"
                >
                  ×
                </button>
              </div>
            ))}
            <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-stone-300 text-stone-400 hover:border-amber-400 hover:text-amber-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? '…' : '+'}
            </label>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || imagePaths.length === 0}
            className="rounded-xl bg-amber-500 px-6 py-2 font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-xl border border-stone-300 px-6 py-2 font-semibold text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
