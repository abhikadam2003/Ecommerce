const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const {sendOrderEmail} = require('../services/email.service');

exports.placeOrder = async(req,res) =>{
    const{shippingAddress} = req.body;
    const user = await User.findById(req.User._id).populate('cart.product')
    if(!user || user.cart.length===0){
        return res.status(400).json({success:false, message:'Cart is Empty'})
    }
    const items = user.cart.map((i)=>({
        product: i.product._id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.priceSnapshot,

    }));
    const total = items.reduce((sum,item)=> sum+item.price*item.quantity,0);
    const order = await Order.create({user:user._id, items, total, shippingAddress});

    await Promise.all(
        user.cart.map((i)=>Product.findByIdAndUpdate(i.product._id, {$inc: {stock: -i.quantity}}))
    );

    user.cart = [];
    await user.save();

    await sendOrderEmail(user.email, order._id, total).catch(()=>{});

    response.status(200).json({success:true,data:order})
};

exports.getMyOrders = async(req, res) => {
    const orders = (await Order.find({user: req.user._id})).sort('-createdAt')
    res.json({success:true, data:orders});
};

exports.getAllOrders = async(req, res)=>{
    const orders = await Order.find({}).populate('user','name', 'emai').sort('-createdAt');
    res.json({success:true, data:orders});
}

exports.updateOrdersStatus = async(req,res) =>{
    const order = await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true});
    if(!order) return res.status(400).json({success:false,
        message:'Order not found'
    });
    res.json({success:true,data:order});
}