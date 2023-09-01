const controller = require('../controller/Cmain');

module.exports = (io) => {
    io.of('/').on('connection', (socket) => {
        controller.connection(io, socket, '/');
    });
    io.of('/new').on('connection', (socket) => {
        controller.connection(io, socket, '/new');
    });
};