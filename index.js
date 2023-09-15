require('dotenv').config();

const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const SocketIo = require('socket.io');
const secret = require('./config/secret');

const app = express();
const PORT = 8000;
const db = require('./models');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(secret.cookieSecret));
app.use("/public", express.static(__dirname + '/public'));

const server = http.createServer(app);
const io = SocketIo(server);


const router = require('./routes/main');
app.use('/', router);

const socketRouter = require('./routes/socket');
socketRouter(io);

app.use('*', (req, res) => {
    res.status(404).render('404');
})

async function startServer() {
    try {
        const sequelize = db.sequelize;
        sequelize.authenticate();

        await sequelize.sync({ force: false }).then(() => {
            server.listen(PORT, () => {
                console.log(`http://localhost:${PORT}`);
            });
        })
    } catch (error) {
        console.error('서버 시작 오류:', error);
    }
}

startServer();