// 문자열 통일 및 오타 방지를 위해 한 곳에 모아두는 공간
const secret = require('../config/secret')


//////////////////////////socket/////////////////////////
const nameSpace = ['/','/new'];



/////////////////////////cookie//////////////////////////
const loginCookie = 'logined'
const maxAge = 60*60*1000
const httpOnly = true
const signed = true
const cookieSetting = {maxAge,httpOnly,signed};




module.exports = {
    nameSpace,
    loginCookie,
    cookieSetting,
};