const {User} = require('../models');
const { v4 } = require('uuid');
const constant = require('../common/constant');
const Cauth = require('./Cauth');


const signUp = async (req,res)=>{
    const {login_id,login_pw,user_name}=req.body
    try {
        const flag = await Cauth.dbIdCheck(login_id)
        if(!flag){
            res.json({result:false , message:'아이디가 중복되어 사용할 수 없습니다'})
            return;
        }
        const hash = await Cauth.pwHashing(login_pw);
        const uuid=v4();
        // console.log('uuid',uuid)
        // const uuidString = await Cauth.uuidToString(uuid)
        // console.log('uuid string',uuidString);
        // const newUuid = await Cauth.stringToUuid(uuidString);
        // console.log('uuid new', newUuid);
        const user = await User.create({
            user_id:uuid,
            login_id,
            login_pw:hash,
            user_name,
            nickname:login_id,
        })
        res.json({result:true,message:`${login_id}님이 회원가입 하셨습니다`,uuid});
    } catch (error) {
        console.log(error);
    }
}

const signIn = async (req,res)=>{
    try {
        const {login_id , login_pw} = req.body;
        const user = await Cauth.dbIdSearch(login_id);
        if(user.length>1){
            console.log('database error 아이디 중복')
            res.json({result:false, message:'사이트 문제로 로그인이 되지 않습니다'})
        } else if(user.length === 1) {
            const {login_pw:dbpw} = user[0];
            const flag = await Cauth.dbpwCompare(login_pw,dbpw);
            if(flag){
                const {user_id,nickname} = user[0];
                const id = Cauth.uuidToString(user_id);
                const cookieValue = {id,nickname};
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

const userLogOut = async (req,res)=>{
    // 쿠키로 할까 했는데 쿠키는 만들기 쉬워서 문제가 나지 않을까 싶음 (타인이 강제 로그아웃 시키는등);
    // 중요한 정보를 다루는 일의 경우에는 session으로 어떤 해쉬값을 db에 넣어놔서
    // 그 값을 이용하는게 좋지 않을까 싶은 (고려중)
}

module.exports = {
    signUp,
    signIn,
}