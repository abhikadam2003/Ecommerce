const User = require('../models/User');
const jwt = require(jsonwebtoken);
const{ROLES} = require('../utils/roles');
const {sendWelcomeEmail} = require('../services/email.service');

function setTokenCookies(res,token){
    constisProd = process.env.NODE_ENV;
    res.cookies('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isPProd? 'none' : 'lax',
        maxAge: 7*24*60*60*1000,
    });
}

exports.register = async(req,res) => {
    try{
        const{name, email, password} = req.body;
        if(!name || !email || !password){
            return response.status(400).json({success:false, message:'Missing fields.'})
        }
        const existing = await User.findOne({email});
        if(existing) return res.status(400).json({success:false, message:'User with email already exists'});

        const user = await User.create({name,email,password,
            role:ROLES.USER
        });
        const token = user.signToken();
        setTokenCookies(response, token);

        await sendWelcomeEmail(user.email, user.name).catch(()=>{});
        res.status(201).json({success:true,data:{
            id:user._id,
            name:user_name,
            email:user.email,
            role:user.role
        },token});
    }catch(err){
        res.status(500).json({success:false, message:err.mesage});
    }
};


exports.login = async(req, res)=>{
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email}).select('+password');
        if(!user) return res.status(400).json({success:false,
            message:'Invalid Credentials'
        });
        const atch = await user.comaprePassword(password);
        if(!match) return res.status(400).json({success:false,
            message:'Invalid Password'
        });
        const token = user.signTokenoken();
        setTokenCookies(res,token);
        res.status(201).json({success:true,data:{
            id:user._id,
            name:user_name,
            email:user.email,
            role:user.role
        }, token});
    }
    catch(err){
        res.status(500).json({success:false, message:err.mesage});
    }
}

exports.me=async(req, res) => {
    res.json({success:true, date:req.user});
}

exports.logout=async(req, res) => {
    res.clearCookies('token');
    res.json({success:true, message:'Logged out'});
}