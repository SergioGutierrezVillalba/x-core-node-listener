require('dotenv').config()
const server = require('./server')();
server.init().then(() => server.listen());