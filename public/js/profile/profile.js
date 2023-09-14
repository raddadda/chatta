let list = [];

(function () {

    getbaordPagenation();

})();

async function getbaordPagenation() {

    try {

        const findAllData_board = await findall_profile_bookmark_board();

        if (findAllData_board.length > 0) {
            const wrap = document.querySelector("#wrap");
            let boxhtml = ``;
            for (let i = 0; i < findAllData_board.length; i++) {
                let date = new Date(`${findAllData_board[i].createdAt}`);
                list.push(findAllData_board[i].board);
                const data = {
                    board_img : findAllData_board[i] && findAllData_board[i].board.board_img ?  findAllData_board[i].board.board_img : '',
                    category: findAllData_board[i] && findAllData_board[i].board.category ?
                        findAllData_board[i].board.category : '',
                    title: findAllData_board[i] && findAllData_board[i].board.title ? findAllData_board[
                        i].board.title : '',
                    views: findAllData_board[i] && findAllData_board[i].board.views ? findAllData_board[
                        i].board.views : 0,
                    createAt: `${date.getFullYear()}-${(date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)}-${date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()} ${date.getHours()}시`
                }
                boxhtml += await list_item(i, data);
                if (findAllData_board.length === i + 1) {
                    page_id = findAllData_board[i].id + 1;
                }
            }
            wrap.innerHTML += boxhtml;

        } else {

            const noneData = document.querySelector('#bookmarkList > .category-list');
            noneData.innerHTML += `  <ul>
                        <li>북마크한 게시물이 없어요</li>
                    </ul>
                `;
        }

    } catch (e) {

        console.log(e);
    }
}

async function chatRoomJoin(board_id) {

    const res = await axios({
        method: "post",
        url: "/chat/join",
        data: {
            room_id: board_id,
        }
    })

    if (res.data.result) {
        alert('채팅방에 참여했습니다')
        document.location.assign('/mychat')
    }
}

// 프로필 수정 버튼 클릭 시 이벤트
document.querySelector('.profile-edit-button').addEventListener('click', function () {
    window.location.href = '/profile/edit';
});

// 게시물 작성 버튼 클릭 시 이벤트 처리
document.querySelector('.friend-info button').addEventListener('click', function () {
    window.location.href = '/post/new';
});

// 카테고리 버튼 클릭 시 목록 토글 이벤트
document.getElementById('chatButton').addEventListener('click', function () {
    toggleList('chatList', this);
});

document.getElementById('bookmarkButton').addEventListener('click', function () {
    toggleList('bookmarkList', this);
});

document.getElementById('scheduleButton').addEventListener('click', function () {
    toggleList('scheduleList', this);
});

// 초기에 모든 목록을 숨김
const listContainers = document.querySelectorAll('.list-container');
listContainers.forEach(function (container) {
    container.style.display = 'none';
});

// 목록을 토글하는 함수
function toggleList(listId, button) {
    const listContainer = document.getElementById(listId);
    if (listContainer.style.display === 'block') {
        listContainer.style.display = 'none';
        button.style.color = 'gray';
    } else {
        // 모든 목록 숨기고 선택한 목록만 보여줌
        listContainers.forEach(function (container) {
            container.style.display = 'none';
        });
        listContainer.style.display = 'block';
        button.style.color = 'black';
    }
}

// 모달 열기
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('board-title')) {
        event.preventDefault();

        const boardId = event.target.getAttribute('data-board-id');

    }
});
