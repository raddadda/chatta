const {User} = require('../models');
const crypto = require('crypto');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const constant = require('../common/constant');
const secret = require('../config/secret');
const {keylen,digest,maxint,minint} = constant.auth

const dbIdCheck = async (login_id) => {
    try {
        const users = await User.findAll({attributes: ["login_id"],where:{login_id}})
        if(users.length>1){
            console.log('database error 아이디 중복');
            return false;
        } else if(users.length == 1){
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}
//데이터 베이스에 해당 로그인 아이디가 존재하는지 확인 함수

const dbIdSearch = async (login_id) =>{
    try {
        const user = await User.findOne({attributes: ["user_id","nickname"] , where:{login_id} , raw:true})
        return user
    } catch (error) {
        console.log(error);
    }
}
// 데이터 베이스에서 로그인 아이디에 해당하는 사이트 내의 user_id와 nickname 호출 함수

const pwHashing = async (pw) => {
    try {
        const hash = await bcrypt.hash(pw,10)
        return hash;
    } catch (error) {
        console.log(error);
    }
}


const dbpwCompare = async (login_id,login_pw) => {
    try {
        const user = await User.findOne({attributes: ["login_pw"],where:{login_id},raw:true})
        const dbpw = user.login_pw;
        const flag = await bcrypt.compare(login_pw,dbpw);
        return flag
    } catch (error) {
        console.log(error);
    }
}


const uuidToString = async (uuid) => {
    try {
        let uuidArr = uuid.split('-');
        const [a,b,c,d,e] = uuidArr;
        const newUuid = b + 'g' + d + 'g' + a + 'g' + e + 'g' + c;
        return newUuid;
    } catch (error) {
        console.log(error);
    }
}
// 사이트에서 쿠키에 uuid 값을 넣을건데 형태가 너무 고정되어
// uuid라는 사실이 알기 쉬우니 한번만 꼬아서 사용


const stringToUuid = async (uuidString)=>{
    try {
        let uuidStringArr = uuidString.split('g');
        const [b,d,a,e,c] = uuidStringArr;
        const newUuid = a + '-' + b + '-' + c + '-' + d + '-' + e;
        return newUuid;
    } catch (error) {
        console.log(error);
    }
}
// 위에서 string으로 바꾼 uuid를 원래 값으로 되돌리는 함수


const saltSlicing = (auth_num)=>{
    try {
        const salt = secret.salt
        const slice = ((auth_num-1) % (salt.length-1)) + 1
        // %값이 0으로 정확하게 떨어지면 salt 길이가 0이 되므로 조정
        // auth_num의 min값이 있어 0이 될 수 없기에 1 빼도 문제 없음
        // salt의 전체 길이를 넘어가는걸 방지해 salt.length도 1을 빼서 계산 (아래에서 (0,slice-1) 해줘도 괜찮)
        const hashSalt = salt.slice(0,slice);
        return hashSalt;
    } catch (error) {
        console.log(error);
    }
}
// 인증에서 사용할 salt를 auth_num에 맞춰서 길이를 잘라
// 매번 다른 salt를 사용할 수 있도록 slicing 해주는 함수


const authCodeIssue = async (user_id)=>{
    try {
        const user = await User.findOne({attributes: ["auth","auth_num"],where:{user_id},raw:true})
        let hash;
        if(user){
            // 정상적인 접근이라면 회원가입을 해서 이미 인증 코드가 들어가 있는 상태에서
            // 로그인으로 접근할때 나오는 코드,
            const {auth,auth_num} = user;
            hash = await authHashing(auth,auth_num + 1,keylen,digest)
            // 로그인을 새로 했으므로 이전에 사용했던 인증 코드 변경
            const userUpdate = await User.update({
                auth_num : auth_num + 1,
                // 변경할때 iter+1 을 했으므로 데이터베이스 조정
            },{
                where:{user_id},
            })
        } else {
            // 정상적인 접근이라면 회원가입 할 때 들어오게 됨
            // 인증 코드를 처음 발급하는 코드
            // 처음으로 발급받는 코드이므로 랜덤을 조금 부여해서 주는거로
            const salt = crypto.randomBytes(minint).toString("base64");
            const iter = crypto.randomInt(maxint)+minint;
            hash = await crypto.pbkdf2Sync(user_id,salt,iter,keylen,digest).toString("base64");
        }
        return hash;
    } catch (error) {
        console.log(error);
    }
}


const authHashing = async (auth,auth_num) => {
    try {
        const salt = saltSlicing(auth_num);
        const hash = await crypto.pbkdf2Sync(auth,salt,auth_num,keylen,digest).toString("base64");
        return hash;
    } catch (error) {
        console.log(error);
    }
}
// auth도 쿠키에 값을 넣을건데 그냥 넣으면 유출 되었을때 좋지 않으므로
// 한번 더 해싱해서 값을 넣는 형태로 설계
// 여기서 한번 더 해싱해서 넣는다는건 쿠키에 넣을 auth 값이고
// 데이터 베이스에는 바로 위의 hashing을 하기 전 auth 값이 저장된다


const loginCookieRes = async (id,nickname,auth,res)=>{
    try {
        const cookieValue = {id,nickname,auth};
        const {loginCookie,cookieSetting} = constant;
        res.cookie(loginCookie,cookieValue,cookieSetting);
    } catch (error) {
        console.log(error);
    }
}


const signUpConst = async (login_pw)=>{
    try {
        const hash = await pwHashing(login_pw);
        const uuid = v4();
        const auth = await authCodeIssue(uuid);
        const auth_num = crypto.randomInt(maxint)+minint;
        return {
            uuid,
            hash,
            auth,
            auth_num,
        }
    } catch (error) {
        console.log(error);
    }
}


const authCheck = async (id,auth)=>{
    try {
        const user_id = await stringToUuid(id)
        const user = await User.findOne({attributes: ["auth","auth_num"],where:{user_id},raw:true})
        if(user){
            // 데이터베이스에 인증 코드가 존재하면 들어오는 코드
            const {auth:dbAuth,auth_num} = user;
            const hash = await authHashing(dbAuth,auth_num);
            if(hash === auth){
                const newAuthNum = crypto.randomInt(maxint)+minint;
                const newAuth = await authHashing(dbAuth,newAuthNum);
                const userUpdate = await User.update({
                    auth_num:newAuthNum,
                },{
                    where:{user_id},
                })
                return {result:true,newAuth}
            }
            return {result:false}
        } else {
            return {result:false};
        }
    } catch (error) {
        console.log(error);
    }
}

const getAuthCheck = async (req,res)=>{
    try {
        const loginCookieValue = req.signedCookies.logined
        if(loginCookieValue){
            const {id,nickname,auth}=loginCookieValue;
            const check = await authCheck(id,auth);
            if(check.result){
                await loginCookieRes(id,nickname,check.newAuth,res)
            } else {
                console.log('쿠키 정보 오류');
                res.redirect('/');
            }
        } else {
            console.log('쿠키가 없음');
            res.redirect('/');
        }
    } catch (error) {
        console.log(error);
    }
}

const authCheckPost = async (req,res)=>{
    try {
        const loginCookieValue = req.signedCookies.logined
        if(loginCookieValue){
            const {id,nickname,auth}=loginCookieValue;
            const check = await authCheck(id,auth);
            if(check.result){
                await loginCookieRes(id,nickname,check.newAuth,res)
                res.json({result:true})
                return;
            }
        }
        res.json({result:false})
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    dbIdCheck,
    dbIdSearch,
    pwHashing,
    dbpwCompare,
    uuidToString,
    stringToUuid,
    authCodeIssue,
    loginCookieRes,
    signUpConst,
    authCheck,
    getAuthCheck,
    authCheckPost,
}