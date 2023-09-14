// 모든 소켓이 동일하게 가지는 함수

console.log("socket", socket);

socket.emit('connection', user_id, nickname, room_id, (users, log) => {
    console.log('user',users)
    socketInfoList = users
    console.log("system : ",log)
});

socket.on('new_member',(data) => {
    const { user_id:new_member_id, nickname, socket_id:new_member_socket } = data
    if(user_id === new_member_id){
        return;
    } else {
        const member = socketInfoList.find((e)=>e.user_id===new_member_id)
        if(member){
            if(member.socket_id !== new_member_socket){
                let newSocketInfoList=[];
                for(const user of socketInfoList){
                    if(member.user_id === user.user_id){
                        const newUser = {
                            user_id: user.user_id,
                            nickname: user.nickname,
                            socket_id: new_member_socket
                        }
                        newSocketInfoList.push(newUser);
                    } else {
                        newSocketInfoList.push(user);
                    }
                }
                socketInfoList = newSocketInfoList;
            } else {
                const socketInfo = {
                    user_id: new_member_id,
                    nickname,
                    socket_id: new_member_socket
                }
                socketInfoList.push(socketInfo);
            }
        } else {
            const socketInfo = {
                user_id: new_member_id,
                nickname,
                socket_id: new_member_socket
            }
            socketInfoList.push(socketInfo);
        }
    }
})