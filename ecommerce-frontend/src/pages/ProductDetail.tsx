import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../utils/currency';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { user } = useAuth();

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getProduct(id!),
    enabled: !!id,
  });

  const product = productData?.data.data;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isInWishlist = wishlist.some(item => item._id === product._id);
  const images = product.images && product.images.length > 0 ? product.images : [''];

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product._id, quantity);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWishlist(product._id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-w-1 aspect-h-1 mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">(4.5) 123 reviews</span>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.stock < 10 && product.stock > 0 && (
              <span className="ml-3 text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                Only {product.stock} left in stock!
              </span>
            )}
            {product.stock === 0 && (
              <span className="ml-3 text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full">Out of Stock</span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Category:</strong> {product.category.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Stock:</strong> {product.stock} available
            </p>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md text-base font-medium text-white ${
                product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            
            <button
              onClick={handleToggleWishlist}
              className={`p-3 rounded-md border ${
                isInWishlist
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Heart className="h-5 w-5" fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
