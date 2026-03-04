import { useState, useEffect } from 'react';
import { getUserDetails, updateProfile } from '../api';
import { useAuth } from '../context/AuthContext';

const emptyAddress = () => ({
  flatNo: '',
  street: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
  isDefault: false,
});

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getUserDetails()
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          const u = res.data.data;
          setName(u.name || '');
          setPhone(u.phone || '');
          setAddresses(
            Array.isArray(u.addresses) && u.addresses.length > 0
              ? u.addresses.map((a) => ({
                  flatNo: a.flatNo || '',
                  street: a.street || '',
                  city: a.city || '',
                  state: a.state || '',
                  country: a.country || '',
                  pincode: a.pincode || '',
                  isDefault: Boolean(a.isDefault),
                }))
              : [emptyAddress()]
          );
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const setAddress = (index, field, value) => {
    setAddresses((prev) => {
      const next = prev.map((a, i) => (i === index ? { ...a, [field]: value } : a));
      if (field === 'isDefault' && value) {
        return next.map((a, i) => (i === index ? { ...a, isDefault: true } : { ...a, isDefault: false }));
      }
      return next;
    });
  };

  const addAddress = () => {
    setAddresses((prev) => [...prev, emptyAddress()]);
  };

  const removeAddress = (index) => {
    if (addresses.length <= 1) return;
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const addressesToSend = addresses.filter(
      (a) => a.flatNo.trim() || a.street.trim() || a.city.trim() || a.state.trim() || a.country.trim() || a.pincode.trim()
    );
    if (addressesToSend.length > 0) {
      const hasAll = addressesToSend.every(
        (a) => a.flatNo.trim() && a.street.trim() && a.city.trim() && a.state.trim() && a.country.trim() && a.pincode.trim()
      );
      if (!hasAll) {
        setMessage({ type: 'error', text: 'Fill all address fields or remove empty addresses.' });
        return;
      }
    }
    setSaving(true);
    try {
      const res = await updateProfile({ name: name.trim(), phone: phone.trim() || undefined, addresses: addressesToSend });
      if (res.data?.success) {
        await refreshUser();
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMessage({ type: 'error', text: res.data?.message || 'Update failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">Profile</h1>
      <p className="text-stone-500 text-sm mb-6">Update your name, phone and delivery addresses.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full rounded-lg border border-stone-200 bg-stone-100 px-3 py-2 text-stone-500 cursor-not-allowed"
          />
          <p className="text-xs text-stone-400 mt-1">Email cannot be changed.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9876543210"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-stone-700">Addresses</label>
            <button
              type="button"
              onClick={addAddress}
              className="text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              + Add address
            </button>
          </div>
          <div className="space-y-4">
            {addresses.map((addr, index) => (
              <div
                key={index}
                className="rounded-xl border border-stone-200 bg-white p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-600">Address {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-sm text-stone-600">
                      <input
                        type="radio"
                        name="defaultAddress"
                        checked={addr.isDefault}
                        onChange={() => setAddress(index, 'isDefault', true)}
                        className="text-amber-500"
                      />
                      Default
                    </label>
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAddress(index)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-0.5">Flat / House No. *</label>
                    <input
                      type="text"
                      value={addr.flatNo}
                      onChange={(e) => setAddress(index, 'flatNo', e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-500 mb-0.5">Street *</label>
                    <input
                      type="text"
                      value={addr.street}
                      onChange={(e) => setAddress(index, 'street', e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-0.5">City *</label>
                    <input
                      type="text"
                      value={addr.city}
                      onChange={(e) => setAddress(index, 'city', e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-0.5">State *</label>
                    <input
                      type="text"
                      value={addr.state}
                      onChange={(e) => setAddress(index, 'state', e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-0.5">Country *</label>
                    <input
                      type="text"
                      value={addr.country}
                      onChange={(e) => setAddress(index, 'country', e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-0.5">Pincode *</label>
                    <input
                      type="text"
                      value={addr.pincode}
                      onChange={(e) => setAddress(index, 'pincode', e.target.value)}
                      className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {message.text && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}
