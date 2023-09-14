//  socket = io('/game') 인 소켓만 가지는 함수

if(nickname === user2){
    socket.emit('game_start',room_id)
}


socket.on('game_first_set',(room_id)=>{
    if(nickname === user1){
        let user = [user1,user2]
        suffle = firstPlayer();
        const black = user[suffle]
        const white = user[(suffle + 1) % 2]
        role = [black,white];
        const black_span = document.getElementById('black')
        const white_span = document.getElementById('white')
        black_span.textContent = black
        white_span.textContent = white
        socket.emit('game_set',role,room_id)
        turn = 0;
    }
})

socket.on('game_base_set',(arg)=>{
    role = arg;
    const black_span = document.getElementById('black')
    const white_span = document.getElementById('white')
    if(nickname === arg[0]){
        currentBlackPlayerInfo.textContent = '(당신 차례)'
    } else if (nickname === arg[1]) {
        currentWhitePlayerInfo.textContent = '(당신 차례)'
    }
    black_span.textContent = arg[0]
    white_span.textContent = arg[1]
    turn = 0;
})

socket.on('js_choose',(player_name,cell)=>{
    if(player_name === nickname){
        return;
    } else {
        const { row, col } = cell;
        choose_flag = true;
        simulateClick(row, col);
        choose_flag = false;
    }
})

function socketSearch(nickname){
    console.log('serch socket',socketInfoList)
    const member = socketInfoList.find((e) => e.nickname === nickname);
    if(!member){
        alert('유저가 접속중이지 않습니다')
    }
    return member.socket_id;
}