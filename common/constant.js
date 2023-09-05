// 문자열 통일 및 오타 방지를 위해 한 곳에 모아두는 공간


//////////////////////////socket/////////////////////////
const nameSpace = ['/','/new'];



/////////////////////////cookie//////////////////////////
const cookieSecret = '2e63b1f6-3820-4071-8bf0-3b0626edaa34'
const maxAge = 60*60*1000
const httpOnly = true
const signed = true
const loginCookie = 'logined'
const cookieSetting = {maxAge,httpOnly,signed};




module.exports = {
    nameSpace,
    maxAge,
    httpOnly,
    cookieSecret,
    loginCookie,
    cookieSetting,
};