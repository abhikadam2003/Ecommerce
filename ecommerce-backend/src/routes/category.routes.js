const router = require('express').Router();
const {createCategory, updateCategory,deleteCategory, getCategory, getCategories} = require('../controller/category.controller');
const {protect, authorize} = require('../middleware/auth');
const ROLES = require("../utils/roles");


router.get('/:id',getCategory);
router.get('/', getCategories);
router.post('/', protect, authorize(ROLES.ADMIN),createCategory);
router.put('/:id',protect, authorize(ROLES.ADMIN), updateCategory);
router.delete('/:id',protect, authorize(ROLES.ADMIN),deleteCategory);

module.exports = router;