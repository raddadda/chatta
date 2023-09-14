(async()=>{
    await memberLoad()
    await chatMsgLoad();
})()

async function memberLoad(){
    const member_list = await axios({
        method: 'post',
        url: '/member/load',
        data: {
            room_id
        }
    })
    memberInfoList = member_list.data.memberInfoList
    if (!member_list.data.result){
        alert('사이트 로직 오류');
        return;
    }
}

function nicknameSearch(user_id){
    const member = memberInfoList.find((e) => e.user_id === user_id);
    return member.nickname;
}

function socketSearch(nickname){
    const member = socketInfoList.find((e) => e.nickname === nickname);
    if(!member){
        alert('유저가 접속중이지 않습니다')
    }
    return member.socket_id;
}

async function chatMsgLoad(){
    const msgs = await axios({
    method: 'post',
    url: '/msg/load',
    data: {
        room_id,
    }
    })
    const {msg_list} = msgs.data
    for (let i = 0; i < msg_list.length; i++){
        const {user_id:msg_user_id,content} = msg_list[i]
        const flag = (msg_user_id === user_id)
        const nickname = nicknameSearch(msg_user_id);
        msgLiAdd(nickname,content,flag)
    }
    const messageList = document.getElementById('message-list');
    messageList.scrollTop = messageList.scrollHeight;
    // 스크롤을 아래로 이동하여 최신 메시지를 보여줍니다.
}

function msgLiAdd(nickname,content,isMine,game){
    const messageList = document.getElementById('message-list');
    const li = document.createElement('li');
    const profileImg = document.createElement('img');
    const user = document.createElement('div');
    const userInfo = document.createElement('div');
    const messageContent = document.createElement('div');
    li.className = 'message';
    profileImg.className = 'profile-img';
    userInfo.className = 'user-info';
    messageContent.className = 'message-content';
    profileImg.src = '/public/giticon.png'; // 프로필 이미지 경로
    userInfo.textContent = nickname;
    messageContent.textContent = content;
    if (isMine) {
        profileImg.style.marginRight = '0';
        profileImg.style.marginLeft = '10px';
        profileImg.style.float = 'right';
        messageContent.style.textAlign = 'right';
        messageContent.style.backgroundColor = '#007bff';
        messageContent.style.color = '#fff';
        li.style.float = 'right';
        li.style.alignItems = 'flex-end';
        userInfo.className = 'user-info my-msg';
    } else {
        if(game){
            li.onclick = (e) => {
                if(confirm('게임에 참여 하시겠습니까?')){
                    // socket.emit
                }
            }
        }
        li.oncontextmenu = (e) => {
            e.preventDefault();
            document.getElementById('user-nickname').textContent = nickname
            showContextMenu(e.clientX, e.clientY);
        }
    }
    user.appendChild(profileImg);
    user.appendChild(userInfo);
    li.appendChild(user);
    li.appendChild(messageContent);
    messageList.appendChild(li);
}

const customContextMenu = document.getElementById('custom-context-menu');

function showContextMenu(x, y) {
    const offsetX = 10;
    const offsetY = 10;
    customContextMenu.style.left = x + offsetX + 'px';
    customContextMenu.style.top = y + offsetY + 'px';
    customContextMenu.style.display = 'block';
}

const menuItems = document.querySelectorAll('.custom-context-menu li');
menuItems.forEach((menuItem) => {
    menuItem.addEventListener('mouseover', (e) => {
        const selectedMenuItem = e.target;
        const menuItemId = selectedMenuItem.id;
        selectedMenuItem.style.backgroundColor = 'skyblue'
    });
    menuItem.addEventListener('mouseleave', (e) => {
        const selectedMenuItem = e.target;
        const menuItemId = selectedMenuItem.id;
        selectedMenuItem.style.backgroundColor = null
    });
    menuItem.addEventListener('click', (e) => {
        const selectedMenuItem = e.target;
        const menuItemId = selectedMenuItem.id;
        const opponent = document.getElementById('user-nickname').innerText
        const my_socket = socketSearch(nickname);
        const opponent_socket = socketSearch(opponent);
        if(menuItemId === 'game'){
            console.log('game click')
            axios ({
                method: 'post',
                url: '/msg/send',
                data: {
                    user_id,
                    room_id,
                    nickname,
                    content: `${nickname}님이 ${opponent}님에게 게임 신청했습니다`,
                    game:true
                }
            }).then((msg_send) => {
                console.log('msg',msg_send)
                const info = {
                    user1: nickname,
                    user2: opponent,
                    my_socket,
                    opponent_socket,
                    room_id
                }
                window.open(`/game?user1=${nickname}&user2=${opponent}`)
                socket.emit('game_open', info)
            })
        }
        
        // 여기에서 각 메뉴 항목을 클릭했을 때의 동작을 정의할 수 있습니다.
        // 예를 들어, 메뉴 항목에 따라 다른 작업을 수행하도록 할 수 있습니다.
        
        // 컨텍스트 메뉴 숨기기
        customContextMenu.style.display = 'none';
    });
});

document.addEventListener('click', () => {
    customContextMenu.style.display = 'none';
});

async function msgSend(){
    const msg = document.getElementById('message-input');
    if(!msg.value){
        return;
    }
    const msg_send = await axios ({
        method: 'post',
        url: '/msg/send',
        data: {
            user_id,
            room_id,
            nickname,
            content: msg.value,
            game:false
        }
    })
    msg.value = ''
    socket.emit('msg_send',msg_send.data);
}