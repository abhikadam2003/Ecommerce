const router = require('express').Router();
const {createProduct,updateProduct,deleteProduct,getProduct,getProducts} = require('../controller/product.controller');
const {protect, authorize} = require('../middleware/auth');
const {uploadMultiple} = require('../middleware/upload');
const {ROLES} = require("../utils/roles");


router.get('/',getProducts);
router.get('/:id', getProduct);

router.post('/',protect,authorize(ROLES.ADMIN), uploadMultiple, createProduct);
router.put('/:id', protect,authorize(ROLES.ADMIN), uploadMultiple, updateProduct);
router.delete('/:id',protect,authorize(ROLES.ADMIN), deleteProduct);

module.exports = router;