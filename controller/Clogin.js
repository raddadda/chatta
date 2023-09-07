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
                await Cauth.loginCookieRes(res,cookieValue);
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
        alert (`${logout.data.id}님이 로그아웃 하셨습니다`)
        res.redirect('/');
    } catch (error) {
        console.log(error);
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
    logoutKakao,
}