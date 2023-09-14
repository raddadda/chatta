socket.on('new_msg',(data)=>{
    const { nickname:msg_nickname, content, game } = data
    const flag = ( msg_nickname === nickname)
    msgLiAdd(msg_nickname, content, flag, game)
    const messageList = document.getElementById('message-list');
    messageList.scrollTop = messageList.scrollHeight;
})

socket.on('game_open_req',(game) => {
    const {user1,user2} = game
    if(confirm(`${user1}님의 게임에 참여 하시겠습니까`)){
        socket.emit('game_accept',game)
        window.open(`/game?user1=${user1}&user2=${user2}`)
    }
})

socket.on('game_accept_res',(game)=>{
    const {user1,user2} = game
    console.log('js game accpet')
    alert('게임 신청이 수락되었습니다')
    window.open(`/game?user1=${user1}&user2=${user2}`)
})
// 왜 안 먹는지는 잘 모르겠음.. 여유 날때 확인