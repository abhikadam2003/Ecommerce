const Product = require('../models/Product');
const { buildSearchFilter, buildCategoryFilter, buildSort, buildPagination } = require('../utils/apiFeatures');

exports.createProduct = async(req, res ) =>{
    try{
        const product = await Product.create(req.body);
        res.status(200).json({success:true, data:product});
    }catch(err){
        res.status(400).json({success:true, message:err.message});
    }
}

exports.updateProduct = async(req , res) =>{
    try{
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!product) return res.status(404).json({success:false, message: 'Product not found'});
        res.json({success:true, data:product});
    }catch(err){
        res.status(400).json({success:true, message:err.message});
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