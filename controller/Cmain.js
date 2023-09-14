const Cauth = require('./Cauth');

const main = async (req, res) => {
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/login')
        return;
    }
    res.render('index');
}

const loginMain = async (req, res) => {
    const { logined } = req.signedCookies;
    if (logined) {
        const getCheck = await Cauth.getAuthCheck(req, res);
        if (getCheck) {
            res.redirect('/')
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