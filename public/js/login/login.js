//////////////////////////document////////////////////////////////////////

const sign_up_div = document.getElementById('sign_up_div');
const sign_in_div = document.getElementById('sign_in_div');
const yearDropdown = document.getElementById('birth-year');
const monthDropdown = document.getElementById('birth-month');
const dayDropdown = document.getElementById('birth-day');


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
            url: "/login",
            data,
        })
        alert(res.data.message);
        if (res.data.result) {
            document.location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}


async function authKaKao() {
    document.location.href = "/signup/kakao";
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        userSignin();
    }
});
