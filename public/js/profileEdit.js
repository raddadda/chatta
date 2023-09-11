// 저장 버튼 함수 (POST)
function edit() {
    const form = document.forms['edit-profile']
    const data = {
        id: form.id.value,
        nick: form.nickName.value,
        email: form.email.value,
    }

    if (!confirm('저장할까요?')) {
        return;
    }
    axios({
        method: 'POST',
        url: '/profile/edit',
        data,
    }).then((res) => {
        if (res.data.result) {
            document.location.href='/profile'
        }
    })
}

function cancel() {
    window.location.href='/profile'
}