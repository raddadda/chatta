async function pwEdit() {
    const resultBox = document.querySelector('.result')
    const form = document.forms['pw-edit']
    const data = {
        id: form.id.value,
        login_id: form.login_id.value,
        login_pw: form.login_pw.value,
        Cpw: form.Cpw.value,
        pw_edit: form.pw_edit.value,
        pw_edit2: form.pw_edit2.value,
    }
    if (!confirm('변경하시겠습니까?')) {
        return;
    }
    const res = await axios({
        method: 'POST',
        url: '/profile/edit/pw',
        data,
    })
    if (res.data.result) {
        alert('변경완료')
        document.location.href='/profile';
    }else if(res.data.result === false) {
        resultBox.textContent = (`${res.data.message}`)
        resultBox.classList.add('show');
    }
}
function cancel() {
    window.location.href='/profile/edit'
}
