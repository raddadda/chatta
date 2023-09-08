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
        const data = {
            user_name: signUpForm.name.value,
            login_id: signUpForm.userid.value,
            login_pw: signUpForm.pw.value,
            gender: signUpForm.gender.value,
            birth: `${signUpForm.year.value}-${signUpForm.month.value}-${signUpForm.day.value}`,
            email: signUpForm.email.value,
        };
        const res = await axios({
            method: "post",
            url: "/signup",
            data,
        });
        alert(res.data.message);
        if (res.data.result) {
            signInVisible();
        }
    } catch (error) {
        console.log(error);
    }
}


//////////////////////////sign_in////////////////////////////////////////

async function userSignin() {
    const signInForm = document.forms["signin-form"];
    try {
        const data = {
            login_id: signInForm.userid.value,
            login_pw: signInForm.pw.value,
        }
        const res = await axios({
            method: "post",
            url: "/signin",
            data,
        })
        alert(res.data.message);
        if (res.data.result) {
            document.location.assign('/profile');
        }
    } catch (error) {
        console.log(error);
    }
}


async function authKaKao() {
    document.location.href = "/signup/kakao";
}


//////////////////////////construct_edit////////////////////////////////////////

function signUpVisible(){
    sign_up_div.hidden = false;
    sign_in_div.hidden = true;
}


function signInVisible(){
    sign_up_div.hidden = true;
    sign_in_div.hidden = false;
}

