// 프로필 이미지 편집 함수 (POST)
async function editProfileImage() {
    const form = document.forms['edit-profile-image'];
    const data = new FormData(form);

    if (!confirm('프로필 사진을 변경하시겠습니까?')) {
        return;
    }

    try {
        const res = await axios.post('/profile/edit/upload', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (res.data.result) {
            alert(`${res.data.message}`);
            document.location.href = '/profile';
        }
    } catch (error) {
        console.error('프로필 이미지 업로드 중 오류 발생:', error);
    }
}

// 저장 버튼 함수 (POST)
async function edit() {
    const form = document.forms['edit-profile']
    const data = {
        id: form.id.value,
        nick: form.nickName.value,
        email: form.email.value,
    }
    if (!confirm('저장할까요?')) {
        return;
    }
    const res = await axios({
        method: 'POST',
        url: '/profile/edit',
        data,
    })
    if (res.data.result) {
        alert(`${res.data.message}`)
        document.location.href = '/profile'
    }
}

function cancel() {
    window.location.href='/profile'
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        edit();
    }
});

