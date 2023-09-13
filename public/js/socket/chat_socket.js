socket.on('new_member',(data) => {
    console.log('new member')
    const { user_id, nickname, key } = data
    const socketInfo = {
        nickname,
        key
    }
    const memberInfo = {
        user_id,
        nickname
    }
    socketInfoList.push(socketInfo);
    memberInfoList.push(memberInfo);
    console.log('socket info',socketInfoList);
})

socket.on('new_msg',(data)=>{
    console.log(data);
    const { nickname:msg_nickname, content, game } = data
    const flag = ( msg_nickname === nickname)
    msgLiAdd(msg_nickname, content, flag, game)
    const messageList = document.getElementById('message-list');
    messageList.scrollTop = messageList.scrollHeight;
    // 스크롤을 아래로 이동하여 최신 메시지를 보여줍니다.
})

socket.on('game_open_req',(game) => {
    const {user1,user2} = game
    console.log('js game open')
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