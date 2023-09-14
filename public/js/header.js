function toggleHeaderProfile () {
    const headerProfile = document.querySelector('.main-header > .header-layout > .header-profie > .header-profile-tab');
    const headerallow = document.querySelector('.main-header > .header-layout > .header-profie > .allow');
    const  body = document.querySelector("body");
    if (window.getComputedStyle(headerProfile).display === 'none') {
        
        headerallow.innerHTML = '&utrif;'
        headerProfile.style.display = 'block';
        setTimeout(() => {
            body.addEventListener('click', clickBodyEvent);
        },[100])

    } else {
        headerallow.innerHTML = '&dtrif;'
        headerProfile.style.display = 'none';
        body.removeEventListener('click', clickBodyEvent);
    }
}
function clickBodyEvent (event) {
    const target = event.target;
    const body = document.querySelector("body");

    if (    target === event.currentTarget.querySelector(".header-profile-tab") || 
            target === event.currentTarget.querySelector(".header-profile-tab > ul")  ) {
        return;
    } else {
     
        toggleHeaderProfile();
        body.removeEventListener('click', clickBodyEvent);
    }   
}

