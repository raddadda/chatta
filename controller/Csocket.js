// const Cauth = require('./Cauth');
// const Cchat = require('./Cchat')

const systemSocket = async (io,socket) => {
    socket.on('connection',(user_id,nickname,cb) => {
        socket.user_id = user_id
        socket.nickname = nickname
        const socketId = socket.id
        cb(`${nickname}님 id:${socketId}로 연결되었습니다`)
    })
}
// 기본적으로 모든 소켓이 가지게 되는 기능

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
        // const user_id = await Cauth.stringToUuid(socket.user_id);
        // console.log("user_id",user_id);
        // await Cchat.myChatRoomList(user_id);
    })
}


module.exports = {
    systemSocket,
    rootSocket,
    newSocket,
    roomSocket,
}