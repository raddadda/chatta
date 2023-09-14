async function userLogOut() {
    try {
        const res = await axios({
            method: "post",
            url: "/logout",
        })
        document.location.href = "/login";
    } catch (error) {
        console.log(error)
    }
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