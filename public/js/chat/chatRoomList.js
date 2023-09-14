const listUl = document.querySelector("#lists");

(async () => { await myChatRoomList() })()

async function myChatRoomList(){
    const myChatRoom = await axios({
        method: "post",
        url: "/load/roomlist",
        data:{user_id}
    })
    let list = myChatRoom.data.roomInfoList;
    const room_list_ul = document.getElementById('room-list')
    for (let i = 0; i < list.length; i++){
        const chatRoom = list[i];
        const li = document.createElement('li');
        const div = document.createElement('div');
        const title = document.createElement('div');
        const category = document.createElement('div');
        const headcount = document.createElement('div');
        const event_time = document.createElement('div');
        li.className = 'room'
        div.className = 'room-info'
        title.className = 'title'
        category.className = 'category'
        headcount.className = 'headcount'
        event_time.className = 'event-time'
        title.textContent = chatRoom.title
        category.textContent = `카테고리 : ${chatRoom.category}`
        headcount.textContent = `인원수 : ${chatRoom.headcount}`
        const date = chatRoom.event_time.slice(0,10);
        const time = chatRoom.event_time.slice(1,16)
        event_time.textContent = `약속시간 : ${date} , ${time}`
        div.appendChild(title)
        div.appendChild(category)
        div.appendChild(headcount)
        div.appendChild(event_time)
        li.appendChild(div)
        li.onmouseover = () => {
            li.style.backgroundColor = 'skyblue'
        }
        li.onmouseleave = () => {
            li.style.backgroundColor = null
        }
        li.ondblclick = () => {
            window.open(`/chat_room?room_id=${chatRoom.room_id}&category=${chatRoom.category}`)
        }
        room_list_ul.appendChild(li)
    }
}