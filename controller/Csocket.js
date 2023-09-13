// const Cauth = require('./Cauth');
// const Cchat = require('./Cchat')
const constant = require('../common/constant');

const systemSocket = async (io,socket) => {
    socket.on('connection',(user_id, nickname, room_id, cb) => {
        const users = [];
        socket.user_id = user_id
        socket.nickname = nickname
        socket.room = room_id
        socket.join(room_id)
        const clients = io.adapter.rooms.get(room_id);
        console.log('clients',clients);
        if (clients) {
            clients.forEach((socketId) => {
                console.log('socket.id',socket.id)
                console.log('socketId',socketId)
                const userSocket = io.sockets.get(socketId);
                const {user_id,nickname} = userSocket
                users.push({user_id,nickname,socket_id:userSocket.id});
            });
            console.log('user',users)
        }
        cb(users,`${nickname}님 id:${socket.id}로 연결되었습니다`)
        io.to(room_id).emit('new_member',{user_id, nickname, socket_id:socket.id})
    })
}
// 기본적으로 모든 소켓이 가지게 되는 기능

const chatSocket = async (io,socket) => {
    socket.on('msg_send',(data) => {
        const { user_id, nickname, room_id, content, game } = data
        io.to(room_id).emit('new_msg',{user_id, nickname, content, game})
    })

    socket.on('game_open',(info) => {
        const { user1, user2, my_socket, opponent_socket } = info
        console.log('info',info);
        io.to(opponent_socket).emit('game_open_req',{user1, user2, opponent_socket:my_socket})
    })

    socket.on('game_accpet',(game) => {
        console.log('cjs game accept')
        const { opponent_socket } = game
        io.to(opponent_socket).emit('game_accept_res',game);
    })
}


const gameSocket = async (io,socket) => {
    socket.on('game_start',(room_id)=>{
        io.to(room_id).emit('game_first_set',room_id)
    })

    socket.on('game_set',(role,room_id)=>{
        io.to(room_id).emit('game_base_set',role)
    })
    socket.on('ejs_choose',(nickname,room_id,cell)=>{
        io.to(room_id).emit('js_choose',nickname,cell)
    })
}

const rootSocket = async(io,socket) => {
    socket.on('open',()=>{
        console.log(`루트접속`)
    })
}

const newSocket = async(io,socket) => {
    socket.on('userLog',()=>{
        console.log(`new접속`)
    })
}

const roomSocket = async (io,socket) => {
    socket.emit('roomList', async (cb) => {
        // console.log(Cauth)
        // const user_id = await Cauth.stringToUuid(socket.user_id);
        // console.log("user_id",user_id);
        // await Cchat.myChatRoomList(user_id);
    })
}


module.exports = {
    systemSocket,
    gameSocket,
    rootSocket,
    newSocket,
    roomSocket,
    chatSocket,
}