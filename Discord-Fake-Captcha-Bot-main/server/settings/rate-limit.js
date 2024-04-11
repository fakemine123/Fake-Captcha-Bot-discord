const rateLimit = require('express-rate-limit').rateLimit

const limiter = rateLimit({
    windowMs: 300000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(400).json({
            'status': 400
        })
    },
    validate: {
        trustProxy: false
    },
})

module.exports = (limiter)