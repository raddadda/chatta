const {User} = require('../models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const constant = require('../common/constant');
const secret = require('../config/secret');

const dbIdCheck = async (login_id) => {
    const users = await User.findAll({attributes: ["login_id"],where:{login_id}})
    if(users.length>1){
        console.log('database error 아이디 중복');
        return false;
    } else if(users.length == 1){
        return true;
    } else {
        return false;
    }
}

const dbIdSearch = async (login_id) =>{
    const user = await User.findOne({attributes: ["user_id","nickname"] , where:{login_id} , raw:true})
    return user
}

const pwHashing = async (pw) => {
    const hash = await bcrypt.hash(pw,10)
    return hash;
}

const dbpwCompare = async (login_id,login_pw) => {
    const user = await User.findOne({attributes: ["login_pw"],where:{login_id},raw:true})
    const dbpw = user.login_pw;
    const flag = await bcrypt.compare(login_pw,dbpw);
    return flag
}

const uuidToString = async (uuid) => {
    let uuidArr = uuid.split('-');
    const [a,b,c,d,e] = uuidArr;
    const newUuid = b + 'g' + d + 'g' + a + 'g' + e + 'g' + c;
    return newUuid;
}

const stringToUuid = async (uuidString)=>{
    let uuidStringArr = uuidString.split('g');
    const [b,d,a,e,c] = uuidStringArr;
    const newUuid = a + '-' + b + '-' + c + '-' + d + '-' + e;
    return newUuid;
}

const saltSlicing = (auth_num)=>{
    const salt = secret.salt
    const slice = ((auth_num-1) % (salt.length-1))+ 1
    // %값이 0으로 정확하게 떨어지면 salt 길이가 0이 되므로 조정
    const hashSalt = salt.slice(0,slice);
    return hashSalt;
}

const authCodeIssue = async (user_id)=>{
    const user = await User.findOne({attributes: ["auth","auth_num"],where:{user_id},raw:true})
    const {keylen,digest,maxint,minint} = constant.auth
    let hash;
    if(user){
        // 정상적인 접근이라면 회원가입을 해서 이미 인증 코드가 들어가 있는 상태에서
        // 로그인으로 접근할때 나오는 코드,
        const {auth,auth_num} = user;
        const hashSalt = saltSlicing(auth_num + 1);
        // auth_num에 적힌 숫자에 맞춰 사용할 salt값을 변경
        hash = await crypto.pbkdf2Sync(auth,hashSalt,auth_num + 1,keylen,digest).toString("base64");
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
        const salt = crypto.randomBytes(minint).toString("base64");
        const iter = crypto.randomInt(maxint)+minint;
        hash = await crypto.pbkdf2Sync(user_id,salt,iter,keylen,digest).toString("base64");
    }
    return hash;
}

const loginCookieRes = async (res,cookieValue)=>{
    const {loginCookie,cookieSetting} = constant;
    res.cookie(loginCookie,cookieValue,cookieSetting);
}

const authCheck = async (id,auth)=>{
    const user_id = await stringToUuid(id)
    const user = await User.findOne({attributes: ["auth","auth_num"],where:{user_id},raw:true})
    if(user){
        // 데이터베이스에 인증 코드가 존재하면 들어오는 코드
        const {keylen,digest,maxint,minint} = constant.auth
        const {auth:dbAuth,auth_num} = user;
        const hashSalt = saltSlicing(auth_num);
        console.log("before",hashSalt)
        const hash = await crypto.pbkdf2Sync(dbAuth,hashSalt,auth_num,keylen,digest).toString("base64");
        if(hash === auth){
            const newAuthNum = crypto.randomInt(maxint)+minint;
            const newHashSalt = saltSlicing(newAuthNum);
            console.log("after",newHashSalt);
            const newAuth = await crypto.pbkdf2Sync(dbAuth,newHashSalt,newAuthNum,keylen,digest).toString("base64");
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
}

const authCheckPost = async (req,res)=>{
    if(req.signedCookies.logined){
        const {id,nickname,auth}=req.signedCookies.logined;
        const check = await authCheck(id,auth);
        if(check.result){
            const cookieValue = {id,nickname,auth:check.newAuth};
            console.log("check newauth",check.newAuth);
            const {loginCookie,cookieSetting} = constant;
            res.cookie(loginCookie,cookieValue,cookieSetting);
            res.json({result:true})
            return;
        }
    }
    res.json({result:false})
}

const authKakao = async (req,res)=>{
    try {
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
        const {profile,birthday,gender} = user.data.kakao_account
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
        let isExist = false;
        if (kakaoIdCheck){
            isExist = true;
        }
        const {kakaoLoginCookie,cookieSetting} = constant;
        res.cookie(kakaoLoginCookie,data,cookieSetting);
        res.redirect('/');
    } catch (error) {
        console.log(error)   
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
    authCheck,
    authCheckPost,
    authKakao,
}