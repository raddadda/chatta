

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


function goTop(){
    window.addEventListener('scroll', () => {
        if ( window.scrollY >100) {
        document.getElementById('scrollby-top').style.display = "block";
        document.getElementById('scrollby-top').addEventListener('click',()=>{
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                });
            })
        } else {
            document.getElementById('scrollby-top').style.display = "none";
        }
    });
}