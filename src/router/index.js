


const router = require('express').Router();

// Health check endpoint for Railway deployment
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Photo Gallery API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
    });
});

// Health check endpoint với chi tiết hơn
router.get('/health', (req, res) => {
    const healthcheck = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: 'Photo Gallery API is healthy',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
            database: 'connected', // Có thể thêm logic check MongoDB sau
            cloudinary: 'configured',
            server: 'running'
        }
    };

    try {
        res.status(200).json(healthcheck);
    } catch (error) {
        healthcheck.status = 'ERROR';
        healthcheck.message = error.message;
        res.status(503).json(healthcheck);
    }
});

router.use("/account", require('./account/account.router'));
router.use("/images", require('./gallery/image.router'));
router.use("/albums", require('./gallery/album.router'));
router.use("/tags", require('./gallery/tag.router'));
module.exports = router;