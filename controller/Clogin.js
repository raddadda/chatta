const constant = require('../common/constant');
const {User} = require('../models');
const Cauth = require('./Cauth');


const signUp = async (req,res)=>{
    const {login_id,login_pw,user_name,gender,birth,email}=req.body
    try {
        const flag = await Cauth.dbIdCheck(login_id)
        if(flag){
            res.json({result:false , message:'아이디가 중복되어 사용할 수 없습니다'})
            return;
        }

        const signConst = await Cauth.signUpConst (login_pw);
        const uuid = await signUpCreate(login_id,user_name,gender,birth,email,signConst);
        res.json({result:true,message:`${login_id}님이 회원가입 하셨습니다`,uuid});
    } catch (error) {
        console.log(error);
    }
}



const signUpCreate = async (login_id,user_name,gender,birth,email,signConst) => {
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
    });
    return uuid;
}


const signIn = async (req,res)=>{
    try {
        const {login_id , login_pw} = req.body;
        const check = await Cauth.dbIdCheck(login_id);
        if(check) {
            const flag = await Cauth.dbpwCompare(login_id,login_pw);
            if(flag){
                const nickname = await Cauth.loginCookieRes(login_id,res);
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
    res.clearCookie(constant.loginCookie);
    res.json({result:true});
}


module.exports = {
    signUp,
    signIn,
    userLogOut,
}