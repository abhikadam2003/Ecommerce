//Global Error Handler

function errorHandler(err, req, res, next){
    const status = err.status || err.statusCode ||500;
    const message = err.message || 'Internal server error';
    const errors = err.errors || undefined;
    if(process.env.NODE_ENV !== 'test'){
        console.error('[ERROR]', status, message);
    }
    res.status(status).json({
        success:false,
        message,
        ...(errors ? {errors} : {}),
    });
}

module.exports = {errorHandler};