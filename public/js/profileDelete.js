async function deleteFunc() {
    const resultBox = document.querySelector('.result')
    const form = document.forms['delete-form']
    const data = {
        id: form.id.value,
        login_id: form.login_id.value,
        login_pw: form.login_pw.value,
        Cid: form.Cid.value,
        Cpw: form.Cpw.value,
    }
    const res = await axios({
        method: 'POST',
        url: '/profile/edit/delete',
        data,
    })
    if (res.data.result) {
        if (!confirm('탈퇴하시겠습니까?')) {
            return;
        }
        alert('회원 탈퇴되었습니다.')
        document.location.href = '/';
    } else {
        resultBox.textContent = (`${res.data.message}`)
        resultBox.classList.add('show');
    }
}
function cancel() {
    window.location.href='/profile/edit'
}