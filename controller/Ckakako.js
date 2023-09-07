const axios = require('axios');
const secret = require('../config/secret');
const Cauth = require('./Cauth');
const constant = require('../common/constant');
const {REST_API_KEY,REDIRECT_URI} = secret;

let Authorization;
let target_id;



const signUpKakao = async (req,res)=>{
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(url);
}

const accessTokenIssue = async (code)=>{
    const token = await axios({
        method: "POST",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        data: {
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code,
        },
    });
    return token.data;
}

const userInfoRef = async (auth)=>{
    const user = await axios({
        method: "POST",
        url: "https://kapi.kakao.com/v2/user/me",
        headers: {
            "Authorization": `Bearer ${auth.access_token}`,
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
    });
    return user.data;
}

const authKakao = async (req,res)=>{
    try {
        const code = req.query.code;
        console.log("query code",code);
        const auth = await accessTokenIssue(code);
        const user = await userInfoRef(auth);
        Authorization = `Bearer ${auth.access_token}`;
        target_id = user.id;
        const {profile,birthday,gender} = user.kakao_account
        const data = {
            id:target_id,
            authorization:Authorization,
            nickname:profile.nickname,
            birth_month:birthday.slice(0,2),
            birth_day:birthday.slice(2,4),
            gender,
        }
        console.log("data",data)
        const kakaoIdCheck = await Cauth.dbIdCheck(target_id);
        if (kakaoIdCheck){
            const user = await Cauth.dbIdSearch(target_id);
            const {user_id,nickname} = user;
            const auth = await Cauth.authCodeIssue(user_id);
            const id = await Cauth.uuidToString(user_id);
            const cookieValue = {id,nickname,auth};
            await Cauth.loginCookieRes(res,cookieValue);
        }
        const {kakaoLoginCookie,cookieSetting} = constant;
        res.cookie(kakaoLoginCookie,data,cookieSetting);
        res.redirect('/');
    } catch (error) {
        console.log(error)   
    }
}


const logoutKakao = async (req,res)=>{
    try {
        const logout = await axios({
            method: "POST",
            url: "https://kapi.kakao.com/v1/user/unlink",
            headers: {
                "Authorization": Authorization,
            },
            data: {
                "target_id_type":"user_id",
                "target_id":target_id,
            },
        })
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    signUpKakao,
    authKakao,
    logoutKakao,
}