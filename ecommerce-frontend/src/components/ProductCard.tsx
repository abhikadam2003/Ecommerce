import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const isInWishlist = wishlist.some(item => item._id === product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product._id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/products/${product._id}`}>
        <div className="relative aspect-w-1 aspect-h-1 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">No Image</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isInWishlist 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className="h-4 w-4" fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </Link>
      
      <div className="p-6">
        <div className="mb-3">
          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-bold text-gray-900 hover:text-primary-600 line-clamp-2 transition-colors duration-200">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">(4.5)</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.stock < 10 && product.stock > 0 && (
              <span className="text-xs text-orange-600 ml-2 bg-orange-100 px-2 py-1 rounded-full">
                Only {product.stock} left!
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-xs text-red-600 ml-2 bg-red-100 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {product.category.name}
          </span>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            <ShoppingCart className="h-4 w-4 inline mr-1" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
