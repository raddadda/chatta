const axios = require('axios');
const { v4 } = require('uuid');
const crypto = require('crypto');
const secret = require('../config/secret');
const constant = require('../common/constant');
const {User} = require('../models');
const Cauth = require('./Cauth');
const {REST_API_KEY} = secret;
const REDIRECT_URI = "http://localhost:8000/oauth/kakao"

let Authorization;
let target_id;

const signUp = async (req,res)=>{
    const {login_id,login_pw,user_name,gender,birth,email}=req.body
    try {
        const flag = await Cauth.dbIdCheck(login_id)
        if(flag){
            res.json({result:false , message:'아이디가 중복되어 사용할 수 없습니다'})
            return;
        }
        const hash = await Cauth.pwHashing(login_pw);

        const uuid = v4();
        const auth = await Cauth.authCodeIssue(uuid);
        const {minint,maxint} = constant.auth;
        const auth_num = crypto.randomInt(maxint)+minint;
        const birthDate = new Date(birth);
        const user = await User.create({
            user_id: uuid,
            login_id,
            login_pw: hash,
            user_name,
            nickname: login_id,
            gender,
            birth: birthDate,
            email,
            auth,
            auth_num,
        });
        res.json({result:true,message:`${login_id}님이 회원가입 하셨습니다`,uuid});
    } catch (error) {
        console.log(error);
    }
}

const signIn = async (req,res)=>{
    try {
        const {login_id , login_pw} = req.body;
        const check = await Cauth.dbIdCheck(login_id);
        if(check) {
            const flag = await Cauth.dbpwCompare(login_id,login_pw);
            if(flag){
                const user = await Cauth.dbIdSearch(login_id);
                const {user_id,nickname} = user;
                const auth = await Cauth.authCodeIssue(user_id);
                const id = await Cauth.uuidToString(user_id);
                const cookieValue = {id,nickname,auth};
                const {loginCookie,cookieSetting} = constant;
                res.cookie(loginCookie,cookieValue,cookieSetting);
                res.json({result:true, message:`${nickname}님 어서오세요`})
            } else {
                res.json({result:false, message:"pw가 일치하지 않습니다"})
            }
        } else {
            res.json({result:false, message:"id가 존재하지 않습니다"})
        }
    } catch (error) {
        console.log(error);
    }
}

const signUpKakao = async (req,res)=>{
    const url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(url);
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
        console.log("logout",logout.data);
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

const authKakao = async (req,res)=>{
    console.log("query code",req.query.code);
    const auth = await axios({
        method: "POST",
        url: "https://kauth.kakao.com/oauth/token",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
        },
        data: {
            grant_type: "authorization_code",
            client_id: REST_API_KEY,
            redirect_uri: REDIRECT_URI,
            code: req.query.code,
        },
    });
    console.log(auth.data);
    try {
        const user = await axios({
            method: "POST",
            url: "https://kapi.kakao.com/v2/user/me",
            headers: {
                "Authorization": `Bearer ${auth.data.access_token}`,
                "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
        });
        Authorization = `Bearer ${auth.data.access_token}`;
        target_id = user.data.id;
        console.log("user",user.data);
        console.log("author",Authorization,"target",target_id)
        res.redirect('/');
    } catch (error) {
        console.log(error)   
    }
}

const userLogOut = async (req,res)=>{
    res.clearCookie(constant.loginCookie);
    res.json({result:true});
}

module.exports = {
    signUp,
    signIn,
    userLogOut,
    signUpKakao,
    authKakao,
    logoutKakao,
}