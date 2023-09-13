function toggleHeaderProfile () {
    const headerProfile = document.querySelector('.main-header > .header-layout > .header-profie > .header-profile-tab');
    const  body = document.querySelector("body");
    if (window.getComputedStyle(headerProfile).display === 'none') {
        
        headerProfile.style.display = 'block';
        setTimeout(() => {
            body.addEventListener('click', clickBodyEvent);
        },[100])

    } else {
        headerProfile.style.display = 'none';
        body.removeEventListener('click', clickBodyEvent);
    }
}
function clickBodyEvent (event) {
    const target = event.target;
    const  body = document.querySelector("body");
    if (target == event.currentTarget.querySelector(".header-profile-tab") ) {
        console.log('여기');

    } else {
        console.log('여기22');
        toggleHeaderProfile();
        body.removeEventListener('click', clickBodyEvent);
    }   
}

