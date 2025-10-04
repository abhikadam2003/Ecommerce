const router = require('express').Router();
const {getCart, addToCart,updateCartItem,removeFromCart, getWishlist,toggleWishlist} = require('../controller/cart.controller');
const {protect} = require('../middleware/auth');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateCartItem);
router.delete('/:productId', protect, removeFromCart);

router.get('/wishlist', protect, getWishlist);
router.post('/wishlist', protect,toggleWishlist);

module.exports = router;