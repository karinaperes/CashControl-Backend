const { Server } = require('./server');
const setupAssociations = require('./models/associations');

setupAssociations();
const serverInstance = new Server();
serverInstance.start();
