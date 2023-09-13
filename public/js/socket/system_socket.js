// 모든 소켓이 동일하게 가지는 함수

console.log("socket", socket);

socket.emit('connection', user_id, nickname, room_id, name_space, (users, log) => {
    console.log('user',users)
    socketInfoList = users
    console.log("system : ",log)
});