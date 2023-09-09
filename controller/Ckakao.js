const axios = require('axios');
const {User} = require('../models');
const secret = require('../config/secret');
const Cauth = require('./Cauth');
const Clogin = require('./Clogin');
const constant = require('../common/constant');
const {REST_API_KEY,REDIRECT_URI} = secret;



const signUpKakao = async (req,res)=>{
    try {
        const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
        res.redirect(url);
    } catch (error) {
        console.log(error);
    }
}


const authKakao = async (req,res)=>{
    try {
        const code = req.query.code;
        const auth = await accessTokenIssue(code);
        const user = await userInfoRef(auth);
        const Authorization = `Bearer ${auth.access_token}`;
        const login_id = `${user.id}`;
        const kakaoIdCheck = await Cauth.dbIdCheck(login_id);
        if (kakaoIdCheck){
            const user = await Cauth.dbIdSearch(login_id);
            const {user_id,nickname} = user;
            const id = await Cauth.uuidToString(user_id);
            const auth = await Cauth.authCodeIssue(user_id);
            await Cauth.loginCookieRes(id,nickname,auth,res);
        } else {
            const {profile,birthday,gender,email} = user.kakao_account
            const signConst = await Cauth.signUpConst(Authorization);
            let birth = null;
            if (birthday){
                birth = `1999-${birthday.slice(0,2)}-${birthday.slice(2,4)}`
            }
            const {uuid} = await Clogin.signUpCreate(login_id,profile.nickname,gender,birth,email,Authorization,signConst)
            const id = await Cauth.uuidToString(uuid);
            const auth = await Cauth.authCodeIssue(uuid);
            await Cauth.loginCookieRes(id,profile.nickname,auth,res)
        }
        res.redirect('/');
    } catch (error) {
        console.log(error)   
    }
}


const accessTokenIssue = async (code)=>{
    try {
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
    } catch (error) {
        console.log(error);
    }
}

const userInfoRef = async (auth)=>{
    try {
        const user = await axios({
            method: "POST",
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {
                "Authorization": `Bearer ${auth.access_token}`,
                "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        });
        return user.data;
    } catch (error) {
        console.log(error);
    }
}

const logoutKakao = async (req,res)=>{
    try {
        const loginCookieValue = req.signedCookies.logined
        if (loginCookieValue){
            const {id,auth} = loginCookieValue;
            const check = await Cauth.authCheck(id,auth);
            if(check.result){
                const token = await tokenLoad(id);
                const logout = await axios({
                    method: "POST",
                    url: "https://kapi.kakao.com/v1/user/unlink",
                    headers: {
                        "Authorization": token.token,
                    },
                    data: {
                        "target_id_type":"user_id",
                        "target_id":token.id,
                    },
                })
                res.clearCookie(constant.loginCookie);
            }
        }
        res.redirect('/login');
    } catch (error) {
        console.log(error);
    }
}

const tokenLoad = async (id) => {
    try {
        const user_id = await Cauth.stringToUuid(id);
        const token = await User.findOne({attributes: ['login_id','token'],where:{user_id},raw:true})
        return token;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    signUpKakao,
    authKakao,
    logoutKakao,
}