// 모든 소켓이 동일하게 가지는 함수

console.log("socket", socket);

socket.emit('connection', user_id, nickname, room_id, (log) => {
    console.log("system : ",log)
});

socket.on('new_msg',(data)=>{
    const {nickname:msg_nickname,content} = data
    const flag = ( msg_nickname === nickname)
    msgLiAdd(msg_nickname,content,flag)
    const messageList = document.getElementById('message-list');
    messageList.scrollTop = messageList.scrollHeight;
    // 스크롤을 아래로 이동하여 최신 메시지를 보여줍니다.
})