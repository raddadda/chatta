console.log('button', document.querySelector('.profile-edit-button'));
// 프로필 수정 버튼 클릭 시 이벤트
document.querySelector('.profile-edit-button').addEventListener('click', function () {
    window.location.href = '/profile/edit';
});

// 게시물 작성 버튼 클릭 시 이벤트 처리
document.querySelector('.friend-info button').addEventListener('click', function () {
    window.location.href = '/post/new';
});

// 카테고리 버튼 클릭 시 목록 토글 이벤트
const categoryButtons = document.querySelectorAll('.category-button');
categoryButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        toggleCategory(this);
    });
});

// 초기에 모든 카테고리 목록을 숨김
const categoryLists = document.querySelectorAll('.category-list');
categoryLists.forEach(function (list) {
    list.style.display = 'none';
});

// 카테고리 목록을 토글하는 함수
function toggleCategory(button) {
    // data-target 속성을 통해 목록의 ID를 가져옴
    const targetList = button.nextElementSibling;

    // 목록 표시 여부를 토글
    if (targetList.style.display === 'block') {
        targetList.style.display = 'none';
        button.style.color = 'gray';
    } else {
        targetList.style.display = 'block';
        button.style.color = 'black';
    }
}