// 모든 소켓이 동일하게 가지는 함수

console.log("socket", socket);

socket.emit('connection', user_id, nickname, (log) => {
    console.log("system : ",log)
});