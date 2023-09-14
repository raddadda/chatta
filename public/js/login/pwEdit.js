async function pwEdit() {
    try {
        const resultBox = document.querySelector('.result')
        const form = document.forms['pw-edit']
        if(!pwFlag){
            alert('비밀번호를 확인해 주세요')
            $('#pw_edit').focus();
            return;
        }
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
            return;
        }else if(res.data.result === false) {
            resultBox.textContent = (`${res.data.message}`)
            resultBox.classList.add('show');
            return;
        }      
    } catch (error) {
        console.log(error)
    }
}

function cancel() {
    window.location.href='/profile/edit'
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        (async() => {
            await pwEdit();
        })()
    }
});

//유효성 검사
let pwFlag;

const pwdCheck = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;

function pwCheck() {
    pwFlag = false
    if(!pwdCheck.test( $("#pw_edit").val() ) ) {
        $('#pwtx').text('영문자+숫자 조합으로 8~25자리 입력해 주세요').addClass('red').removeClass('green')
        return
    }  
    if($('#pw_edit').val() == "") {
        $('#pwtx').text('비밀번호를 입력하세요').addClass('red').removeClass('green')
        return
    }
    if($('#pw_edit').val() !== $('#pw_edit2').val()) {
        $('#pwtx').text('비밀번호가 일치하지 않습니다').addClass('red').removeClass('green')
        return
    }
    if($('#pw_edit').val() == $('#pw_edit2').val()) {
        $('#pwtx').text('비밀번호가 일치합니다').addClass('green').removeClass('red')
        pwFlag = true
    }
    return;
}