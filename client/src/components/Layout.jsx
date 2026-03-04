import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-stone-900 hover:text-amber-600 transition-colors"
          >
            Your Store
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/products"
              className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors"
            >
              Products
            </Link>
            {user ? (
              <>
                <Link
                  to="/cart"
                  className="relative flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors"
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-semibold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/orders"
                  className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors"
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors"
                >
                  Profile
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className="text-sm font-medium text-amber-600 hover:text-amber-700"
                    >
                      Admin
                    </Link>
                    <Link
                      to="/admin/products"
                      className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors"
                    >
                      Manage Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="text-sm font-medium text-stone-600 hover:text-amber-600 transition-colors"
                    >
                      Admin Orders
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-2 border-l border-stone-200 pl-4">
                  <span className="text-sm text-stone-500">{user?.name}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg bg-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-300 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg bg-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-300 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="mt-auto border-t border-stone-200 bg-stone-100 py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-stone-500 sm:px-6">
          © {new Date().getFullYear()} Your Store. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
