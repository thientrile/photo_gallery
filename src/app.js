


const e = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = e();
app.use(cors({
    origin: "*",              // cho phép tất cả domain
    methods: "GET,POST,PUT,DELETE,OPTIONS", // hoặc ["*"]
    allowedHeaders: "*",      // cho phép tất cả header
}))
app.use(morgan('combined'));
app.use(helmet());
app.use(compression());
app.use(e.json()); // for parsing application/json
app.use(e.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// middleware
// connect to MongoDB
require('./utils/mongo/Connect.js');


//  init router
app.use('/api', require('./router/index.js'));
// handle error


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// # error management function
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    console.log(error);
    return res.status(statusCode).json({
        status: 'Error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    });
});









const http = require('http').Server(app);

module.exports = http;