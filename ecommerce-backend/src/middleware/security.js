const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

function applySecurity(app){
    app.use(helmet());
    app.use(cors({
        origin: (origin, callback) => {
            const allowed = new Set([
                (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''),
            ]);
            if (!origin) return callback(null, true);
            const normalized = origin.replace(/\/$/, '');
            if (allowed.has(normalized)) return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    }));
    app.use(
        rateLimit({
            windowsMs: 15*60*1000,
            max: 1000,
            standardHeaders : true,
            legacyHeaders: false
        })
    );
}

module.exports = {applySecurity}