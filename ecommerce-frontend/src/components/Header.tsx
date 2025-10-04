import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, wishlistCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">E-Shop</h1>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-blue-600">
              Products
            </Link>
            
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin
                  </Link>
                )}
                <Link to="/orders" className="text-gray-700 hover:text-blue-600">
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600">
                  Register
                </Link>
              </>
            )}

            {/* Cart and Wishlist Icons */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative text-gray-700 hover:text-blue-600">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <Link to="/wishlist" className="relative text-gray-700 hover:text-blue-600">
                <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pt-4">
              <Link to="/products" className="text-gray-700 hover:text-blue-600 py-2">
                Products
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 py-2">
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 py-2">
                      Admin
                    </Link>
                  )}
                  <Link to="/orders" className="text-gray-700 hover:text-blue-600 py-2">
                    Orders
                  </Link>
                  <Link to="/cart" className="text-gray-700 hover:text-blue-600 py-2 flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Cart ({cartCount})
                  </Link>
                  <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 py-2 flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Wishlist ({wishlistCount})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-blue-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 py-2">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-700 hover:text-blue-600 py-2">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
