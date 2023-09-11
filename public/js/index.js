

async function cookieAuthCheck(){
    const res = await axios({
        method:'post',
        url:'/auth'
    })
    console.log("auth res",res);
}

async function userLogOut() {
    const res = await axios({
        method: "post",
        url: "/logout",
    })
    document.location.href = "/login";
}


function logoutKaKao(){
    document.location.href = "/kakao/leave";
}