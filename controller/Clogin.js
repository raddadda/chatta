const {User} = require('../models');
const bcrypt = require('bcrypt');
const { v4 } = require('uuid');

const dbIdCheck = async (login_id) => {
    const result = await User.findAll({where:{login_id}})
    if(result.length > 0){
        return false;
    } else {
        return true;
    }
}

const pwHashing = async (pw) => {
    const hash = await bcrypt.hash(pw,10)
    return hash;
}

const dbpwCompare = async (pw,dbpw) => {
    const flag = await bcrypt.compare(pw,dbpw);
    return flag
}
    
const signUp = async (req,res)=>{
    const {login_id,login_pw,user_name}=req.body
    try {
        const flag = await dbIdCheck(login_id)
        if(!flag){
            res.json({result:false , message:'아이디가 중복되어 사용할 수 없습니다'})
            return;
        }
        const hash = await pwHashing(login_pw);
        const uuid=v4();
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
        const result = await User.findAll({where:{login_id}})
        console.log('result',result.length);
        if(result.length>1){
            console.log('database error 아이디 중복')
            res.json({result:false, message:'사이트 문제로 로그인이 되지 않습니다'})
        } else if(result.length === 1) {
            const {login_pw:dbpw} = result[0];
            const flag = await dbpwCompare(login_pw,dbpw);
            if(flag){
                const {nickname} = result[0];
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

module.exports = {
    signUp,
    signIn,
}