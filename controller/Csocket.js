// const Cauth = require('./Cauth');
// const Cchat = require('./Cchat')
const constant = require('../common/constant');

const systemSocket = async (io,socket) => {
    socket.on('connection',(user_id, nickname, room_id, name_space, cb) => {
        const users = [];
        //채팅룸에 접속한 socket.id값을 찾아야함
        socket.user_id = user_id
        socket.nickname = nickname
        socket.room = room_id
        socket.join(room_id)
        const nameclient = io.of(name_space).sockets
        if (nameclient) {
            nameclient.forEach((sockets) => {
                const client = sockets.adapter.rooms.get(room_id)
                client.forEach((socketId)=>{
                    const userSocket = io.of(name_space).sockets.get(socketId);
                    const info = { nickname: userSocket.nickname, key: socketId }
                    const flag = users.find((e) => e.key === socketId);
                    if(flag){
                        return
                    }
                    users.push(info);
                })
            });
            console.log('user',users)
        }
        const socketId = socket.id
        cb(users,`${nickname}님 id:${socketId}로 연결되었습니다`)
        io.of(name_space).to(room_id).emit('new_member',{user_id, nickname, key:socketId})
    })
}
// 기본적으로 모든 소켓이 가지게 되는 기능

const chatSocket = async (io,socket) => {
    socket.on('msg_send',(data) => {
        const { user_id, nickname, room_id, content, game } = data
        io.of('/chat').to(room_id).emit('new_msg',{user_id, nickname, content, game})
    })

    socket.on('game_open',(info) => {
        const { user1, user2, my_socket, opponent_socket } = info
        console.log('info',info);
        io.of('/chat').to(opponent_socket).emit('game_open_req',{user1, user2, opponent_socket:my_socket})
    })

    socket.on('game_accpet',(game) => {
        console.log('cjs game accept')
        const { opponent_socket } = game
        io.of('/chat').to(opponent_socket).emit('game_accept_res',game);
    })
}


const gameSocket = async (io,socket) => {
    socket.on('open',()=>{
        console.log('게임 접속')
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