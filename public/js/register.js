//////////////////////////document////////////////////////////////////////

const sign_up_div = document.getElementById('sign_up_div');
const sign_in_div = document.getElementById('sign_in_div');
const yearDropdown = document.getElementById('birth-year');
const monthDropdown = document.getElementById('birth-month');
const dayDropdown = document.getElementById('birth-day');


//////////////////////////sign_up_form////////////////////////////////////////

for (let year = new Date().getFullYear(); year >= 1900; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.text = year;
    yearDropdown.appendChild(option);
}


for (let month = 1; month <= 12; month++) {
    const option = document.createElement('option');
    option.value = month;
    option.text = month;
    monthDropdown.appendChild(option);
}

for (let day = 1; day <= 31; day++) {
    const option = document.createElement('option');
    option.value = day;
    option.text = day;
    dayDropdown.appendChild(option);
}


//////////////////////////sign_up////////////////////////////////////////

async function userSignUp() {
    const signUpForm = document.forms["signup-form"];
    try {
        if(!idFlag){
            alert('아이디를 확인해 주세요')
            return;
        }
        if(!pwFlag){
            alert('비밀번호를 확인해 주세요')
            return;
        }
        const data = {
            user_name: signUpForm.name.value,
            login_id: signUpForm.userid.value,
            login_pw: signUpForm.pw.value,
            Cpw : signUpForm.Cpw.value,
            gender: signUpForm.gender.value,
            birth: `${signUpForm.year.value}-${signUpForm.month.value}-${signUpForm.day.value}`,
            email: signUpForm.email.value,
        };
        const res = await axios({
            method: "post",
            url: "/register",
            data,
        });
        alert(res.data.message);
        if (res.data.result) {
            document.location.href='/login'
        }
    } catch (error) {
        console.log(error);
    }
}

/////////////////////////이메일 인증/////////////////
// function emailAuth() {
//     auth.hidden = false;
// }

//////////////유효성 검사///////////////

let idFlag;
let pwFlag;

const pwdCheck = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,25}$/;

function idCheck() {
    idFlag = false;
    if($('#userid').val() == "") {
        $('#idtx').text('아이디를 입력하세요').css({
            "color": "red",
            "font-size": "11px",
            "text-align" : "start"
        });
        return;
    }
    if($('#userid').val() !== "") {
        $('#idtx').text('')
    }
    idFlag = true;
    return;
}

function pwCheck() {
    pwFlag = false
    if(!pwdCheck.test( $("#pw").val() ) ) {
        $('#pwtx').text('영문자+숫자 조합으로 8~25자리 입력해 주세요').css({
            "color": "red",
            "font-size": "11px",
            "text-align" : "start"
        });
        return
    }  
    if($('#pw').val() == "") {
        $('#pwtx').text('비밀번호를 입력하세요').css({
            "color": "red",
            "font-size": "11px",
            "text-align" : "start"
        });
        return
    }
    if($('#pw').val() !== $('#Cpw').val()) {
        $('#pwtx').text('비밀번호가 일치하지 않습니다').css({
            "color": "red",
            "font-size": "11px",
            "text-align" : "start"
        });
        return
    }
    if($('#pw').val() == $('#Cpw').val()) {
        $('#pwtx').text('비밀번호가 일치합니다').css({
            "color": "green",
            "font-size": "11px",
            "text-align" : "start"
        });
        pwFlag = true
    }
    return;
}
