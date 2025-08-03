

const config= require('./config');
const httpServer = require('./src/app.js');
require('dotenv').config();

const port =config.app.port || 3000;

const host =config.app.host||'localhost'


const server =httpServer.listen(port,  () => {
  console.log(`Server is running on http://${host}:${port}`);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

