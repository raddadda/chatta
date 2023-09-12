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
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('board-title')) {
        event.preventDefault();

        const boardId = event.target.getAttribute('data-board-id');
        
    }
});
