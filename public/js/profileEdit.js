// 저장 버튼 함수 (POST)
async function edit() {
    const form = document.forms['edit-profile']
    const data = {
        id: form.id.value,
        nick: form.nickName.value,
        email: form.email.value,
    }
    if(!confirm('저장할까요?')) {
        return;
    }
    const res = await axios({
        method: 'POST',
        url: '/profile/edit',
        data,
    })
    if (res.data.result) {
        alert(`${res.data.message}`)
        document.location.href='/profile'
    }
}

function cancel() {
    window.location.href='/profile'
}