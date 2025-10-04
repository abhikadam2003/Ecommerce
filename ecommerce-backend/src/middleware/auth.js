const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {ROLES} = require('../utils/roles');

async function protect(req, res,next){
    try{
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.substring(7) : req.cookies.token;
        if(!token) return res.status(401).json({success:false, message:'Not authenticated'});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if(!user) return res.status(401).json({success:false, message:'User not found'});
        req.user = user;
        next();
    }catch(err){
        return res.status(401).json({success:false, message:'Invalid token'});
    }
}

function authorize(...allowed){
    return(req, res, next) => {
        if(!req.user) return res.status(401).json({success:false, message:'Not authenticated'});
        if(!allowed.includes(req.user.role)) {
            return  res.status(401).json({success:false, message:'Forbidden'});
        }
        next();
    };
}

module.exports = {protect,authorize}