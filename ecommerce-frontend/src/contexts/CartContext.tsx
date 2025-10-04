import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  cartCount: number;
  wishlistCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  clearCart: () => void;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    if (user) {
      fetchCartData();
    } else {
      setCart([]);
      setWishlist([]);
    }
  }, [user]);

  const fetchCartData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [cartResponse, wishlistResponse] = await Promise.all([
        cartAPI.getCart(),
        cartAPI.getWishlist(),
      ]);
      
      if (cartResponse.data.success) {
        setCart(cartResponse.data.data);
      }
      
      if (wishlistResponse.data.success) {
        setWishlist(wishlistResponse.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch cart data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const response = await cartAPI.addToCart(productId, quantity);
      if (response.data.success) {
        setCart(response.data.data);
        toast.success('Added to cart!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const updateCartItem = async (productId: string, quantity: number) => {
    if (!user) return;

    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      const response = await cartAPI.removeFromCart(productId);
      if (response.data.success) {
        setCart(response.data.data);
        toast.success('Removed from cart');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove from cart');
    }
  };

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      const response = await cartAPI.toggleWishlist(productId);
      if (response.data.success) {
        setWishlist(response.data.data);
        const isInWishlist = wishlist.some(item => item._id === productId);
        toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    wishlist,
    cartCount,
    wishlistCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    toggleWishlist,
    clearCart,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
