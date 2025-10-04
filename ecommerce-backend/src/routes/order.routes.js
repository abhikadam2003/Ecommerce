const router = require('express').Router();
const {placeOrder, getMyOrders, getAllOrders,updateOrderStatus} = require('../controller/order.controller');
const {protect, authorize} = require('../middleware/auth');
const {ROLES} = require("../utils/roles");



router.post('/', protect, placeOrder);
router.get('/me', protect, getMyOrders);

router.get('/', protect,authorize(ROLES.ADMIN),getAllOrders);
router.post('/', protect,authorize(ROLES.ADMIN),updateOrderStatus);

module.exports = router;
