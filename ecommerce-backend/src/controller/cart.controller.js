const User = require('../models/User');
const Product = require('../models/Product');

// 🛒 Get Cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'cart.product',
        select: 'name images category stock price',
        populate: {
          path: 'category',
          select: 'name'
        }
      });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user.cart });
  } catch (error) {
    console.error('Error in getCart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ➕ Add to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const existing = user.cart.find(
      (item) => String(item.product) === String(productId)
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({
        product: productId,
        quantity,
        priceSnapshot: product.price
      });
    }

    await user.save();

    // repopulate after save
    await user.populate({
      path: 'cart.product',
      select: 'name images category stock price',
      populate: { path: 'category', select: 'name' }
    });

    res.json({ success: true, data: user.cart });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 🔄 Update Item Quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);
    const item = user.cart.find((i) => String(i.product) === String(productId));

    if (!item)
      return res.status(404).json({ success: false, message: 'Item not found' });

    item.quantity = quantity;
    await user.save();

    await user.populate({
      path: 'cart.product',
      select: 'name images category stock price',
      populate: { path: 'category', select: 'name' }
    });

    res.json({ success: true, data: user.cart });
  } catch (error) {
    console.error('Error in updateCartItem:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ❌ Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => String(i.product) !== String(productId));

    await user.save();

    await user.populate({
      path: 'cart.product',
      select: 'name images category stock price',
      populate: { path: 'category', select: 'name' }
    });

    res.json({ success: true, data: user.cart });
  } catch (error) {
    console.error('Error in removeFromCart:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ❤️ Get Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    console.error('Error in getWishlist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// 💖 Toggle Wishlist
exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    const exists = user.wishlist.find((p) => String(p) === String(productId));

    if (exists) {
      user.wishlist = user.wishlist.filter((p) => String(p) !== String(productId));
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    await user.populate('wishlist');

    res.json({ success: true, data: user.wishlist });
  } catch (error) {
    console.error('Error in toggleWishlist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
