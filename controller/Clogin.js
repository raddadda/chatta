const constant = require('../common/constant');
const {User} = require('../models');
const Cauth = require('./Cauth');


const signUp = async (req,res)=>{
    try {
        const {login_id,login_pw,user_name,gender,birth,email}=req.body
        const flag = await Cauth.dbIdCheck(login_id)
        if(flag){
            res.json({result:false , message:'아이디가 중복되어 사용할 수 없습니다'})
            return;
        }
        const signConst = await Cauth.signUpConst (login_pw);
        const birthday = new Date (birth);
        const {uuid} = await signUpCreate(login_id,user_name,gender,birthday,email,null,signConst);
        res.json({result:true,message:`${login_id}님이 회원가입 하셨습니다`,uuid});
    } catch (error) {
        console.log(error);
    }
}



const signUpCreate = async (login_id,user_name,gender,birth,email,token,signConst) => {
    try {
        const {uuid,hash,auth,auth_num} = signConst;
        const user = await User.create({
            user_id: uuid,
            login_id,
            login_pw: hash,
            user_name,
            nickname: login_id,
            gender,
            birth,
            email,
            auth,
            auth_num,
            token,
        });
        return {uuid,auth};
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
                const id = await Cauth.uuidToString(user_id);
                const auth = await Cauth.authCodeIssue(user_id);
                await Cauth.loginCookieRes(id,nickname,auth,res);
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


const userLogOut = async (req,res)=>{
    try {
        res.clearCookie(constant.loginCookie);
        res.json({result:true});
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    signUp,
    signIn,
    signUpCreate,
    userLogOut,
}