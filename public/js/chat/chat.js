(async()=>{
    await memberLoad()
    await chatMsgLoad();
})()

async function memberLoad(){
    try {
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
    } catch (error) {
        console.log(error)
    }
}

function nicknameSearch(user_id){
    try {
        const member = memberInfoList.find((e) => e.user_id === user_id);
        const nickname = member.nickname;
        return nickname;
    } catch (error) {
        console.log(error);
        return '';
    }
}

function socketSearch(nickname){
    try {
        const member = socketInfoList.find((e) => e.nickname === nickname);
        if(!member){
            alert('유저가 접속중이지 않습니다')
        }
        const socket_id = member.socket_id
        return socket_id;
    } catch (error) {
        console.log(error)
        return '';
    }
}

async function chatMsgLoad(){
    try {
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
    } catch (error) {
        console.log(error)
    }
}

function msgLiAdd(nickname,content,isMine,game){
    try {
        const messageList = document.getElementById('message-list');
        const li = document.createElement('li');
        // const profileImg = document.createElement('img');
        const user = document.createElement('div');
        const userInfo = document.createElement('div');
        const messageContent = document.createElement('div');
        li.className = 'message';
        // profileImg.className = 'profile-img';
        userInfo.className = 'user-info';
        messageContent.className = 'message-content';
        // profileImg.src = '/public/giticon.png'; // 프로필 이미지 경로
        userInfo.textContent = nickname;
        messageContent.textContent = content;
        if (isMine) {
            // profileImg.style.marginRight = '0';
            // profileImg.style.marginLeft = '10px';
            // profileImg.style.float = 'right';
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
        // user.appendChild(profileImg);
        user.appendChild(userInfo);
        li.appendChild(user);
        li.appendChild(messageContent);
        messageList.appendChild(li);
    } catch (error) {
        console.log(error)
    }
}

const customContextMenu = document.getElementById('custom-context-menu');

function showContextMenu(x, y) {
    try {
        const offsetX = 10;
        const offsetY = 10;
        customContextMenu.style.left = x + offsetX + 'px';
        customContextMenu.style.top = y + offsetY + 'px';
        customContextMenu.style.display = 'block';
    } catch (error) {
        console.log(error)
    }
}

try {
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
            customContextMenu.style.display = 'none';
        });
    })
} catch (error) {
    console.log(error)
}

document.addEventListener('click', () => {
    customContextMenu.style.display = 'none';
});

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
messageInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        sendButton.click()
    }
})

async function msgSend(){
    try {
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
    } catch (error) {
        console.log(error);
    }
}