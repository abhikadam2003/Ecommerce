const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const {applySecurity} = require('./middleware/security');
const {errorHandler} = require('./middleware/error');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET || ''));
if(process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

applySecurity(app);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health',(req, res)=>{
    res.json({success:true, message:'Ok'});
})

app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/orders',orderRoutes);

app.use((req, res)=>{
    res.status(404).json({success:false, message: ' Not found'});
})

app.use(errorHandler);

module.exports = app;