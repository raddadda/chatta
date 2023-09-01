const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const SocketIo = require('socket.io');

const app = express();
const PORT = 8000;
const db = require('./models');

const server = http.createServer(app);

const io = SocketIo(server);

io.of("/").on('connection',(socket)=>{
    socket.on('userLog',()=>{
        console.log("루트 접속")
    })
})
// 확인상 넣어놓긴 했지만 링크 개념이라 '/'는 루트가 되서 생략해도 됨
// 즉, 이 경우 io.on('connection')형태로 바로 가도 됨

io.of("/new").on('connection',(socket)=>{
    socket.on('userLog',()=>{
        console.log("new 접속")
    })
})

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use('img',express.static(__dirname+'img'));


const router = require('./routes/main');
app.use('/',router);

app.use('*',(req,res)=>{
    res.status(404).render('404');
})

db.sequelize.sync({force:true}).then(()=>{
    server.listen(PORT,()=>{
        console.log(`http://localhost:${PORT}`);
    })
})