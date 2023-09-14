const Cauth = require('./Cauth');
const Cimage = require('./Cimage');

const main = async (req, res) => {
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/login')
        return;
    }

    const cookieValue = req.signedCookies.logined.id;
    const userId = await Cauth.stringToUuid(cookieValue);
    const profileImage = await Cimage.getProfileImage(userId);

    res.render('index', { profileImage });
}

const loginMain = async (req, res) => {
    const { logined } = req.signedCookies;
    if (logined) {
        const getCheck = await Cauth.getAuthCheck(req, res);
        if (getCheck) {
            res.redirect('/')
            return;
        }
    }
    res.render('login');
}

const myChatMain = async (req, res) => {
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/login')
        return;
    }
    const { id, nickname } = req.signedCookies.logined
    res.render('chatRoomList', { id, nickname });
}


module.exports = {
    main,
    loginMain,
    myChatMain,
}