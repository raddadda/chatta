const rootSocket = async(io,socket)=>{
    socket.on('userLog',()=>{
        console.log(`루트접속`)
    })
}

const newSocket = async(io,socket)=>{
    socket.on('userLog',()=>{
        console.log(`new접속`)
    })
}


module.exports = {
    rootSocket,
    newSocket,
}