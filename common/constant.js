// 문자열 통일 및 오타 방지를 위해 한 곳에 모아두는 공간
const secret = require('../config/secret')
const Csocket = require('../controller/Csocket')


//////////////////////////socket/////////////////////////
const nameSpace = [{
    name: '/',
    category: 'sports',
    func: Csocket.rootSocket
},{
    name: '/new',
    category: null,
    func: Csocket.newSocket
},{
    name: '/room',
    category: null,
    func: Csocket.roomSocket
},
]



/////////////////////////cookie//////////////////////////
const loginCookie = 'logined'
const maxAge = 60 * 60 * 1000
const httpOnly = true
const signed = true
const cookieSetting = { maxAge, httpOnly, signed };


/////////////////////////auth//////////////////////////
const keylen = 64
const digest = 'sha512'
const maxint = 16
const minint = 3
const auth = { keylen, digest, maxint, minint };


module.exports = {
    nameSpace,
    loginCookie,
    cookieSetting,
    auth,
};