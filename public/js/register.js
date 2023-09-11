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
