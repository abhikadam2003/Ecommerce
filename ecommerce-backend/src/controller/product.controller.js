const Product = require('../models/Product');
const { buildSearchFilter, buildCategoryFilter, buildSort, buildPagination } = require('../utils/apiFeatures');
const path = require('path');

exports.createProduct = async(req, res ) =>{
    try{
        // Handle image uploads
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/${file.filename}`);
        }
        
        const productData = {
            ...req.body,
            images: images
        };
        
        const product = await Product.create(productData);
        res.status(201).json({success:true, data:product});
    }catch(err){
        res.status(400).json({success:false, message:err.message});
    }
}

exports.updateProduct = async(req , res) =>{
    try{
        // Handle image uploads
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/${file.filename}`);
        }
        
        const updateData = {
            ...req.body,
            ...(images.length > 0 && { images: images })
        };
        
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, {new: true, runValidators: true});
        if(!product) return res.status(404).json({success:false, message: 'Product not found'});
        res.json({success:true, data:product});
    }catch(err){
        res.status(400).json({success:false, message:err.message});
    }
}

exports.deleteProduct = async(req , res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({success: false, message: ' Product does not exists'});
        res.json({success:true, message: 'Product deleted'})
    }catch(err){
        res.status(400).json({success:true, message:err.message});
    }
}

exports.getProduct = async(req , res) =>{
    const product = await Product.findById(req.params.id).populate('category');
    if(!product) return res.status(404).json({succes:false, message:'Product not found'});
    res.json({success:true, data:product});
}

exports.getProducts = async(req , res) =>{
    try {
        const filter = { ...buildSearchFilter(req.query, ['name', 'description']), ...buildCategoryFilter(req.query) };
        const sort = buildSort(req.query);
        const { skip, limit, page } = buildPagination(req.query);

        const [items, total] = await Promise.all([
            Product.find(filter).populate('category').sort(sort).skip(skip).limit(limit),
            Product.countDocuments(filter),
        ]);

        res.json({ success:true, data:items, pagination:{ page, limit, total, pages:Math.ceil(total/limit) } });
    } catch (err) {
        res.status(500).json({ success:false, message: err.message });
    }
};