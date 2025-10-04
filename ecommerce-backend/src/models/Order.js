const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
        name: {type: String, required: true},
        quantity: { type:Number, required :true} ,
        price:{type:Number, required :true} ,
    },
    {_id: false}
);

const orderSchema = new mongoose.Schema(
    {
       user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true} ,
       items:{type:[orderItemSchema], required: true},
       total: {type:Number, required:true},
       status:{type:String, enum:['pending', 'processing','shipped','delivered','cancelled'], default :'pending'} ,
       shippingAddress: {type:String, required:true},
    },
    {timestamps:true}
);

module.exports = mongoose.model('Order', orderSchema);