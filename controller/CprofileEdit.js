const { User } = require('../models');
const { v4 } = require('uuid');
const constant = require('../common/constant');
const Cauth = require('./Cauth');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mailer = require('../routes/mail');
const crypto = require('crypto')

///////////GET////////////
const profileUpdate = async (req, res) => {
    try {
        const getCheck = await Cauth.getAuthCheck(req,res);
        if(!getCheck){
            res.redirect('/')
            return;
        }
        const cookieValue = req.signedCookies.logined.id;
        console.log(cookieValue)
        const userId = await Cauth.stringToUuid(cookieValue);
        
        const user = await User.findOne({ where: { user_id: userId } });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.render('profileEdit', { user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const pwUpdate = async (req, res) => {
    try {
        const getCheck = await Cauth.getAuthCheck(req,res);
        if(!getCheck){
            res.redirect('/')
            return;
        }
        const cookieValue = req.signedCookies.logined.id;
        console.log(cookieValue)
        const userId = await Cauth.stringToUuid(cookieValue);
        
        const user = await User.findOne({ where: { user_id: userId } });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.render('pwEdit', { user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const profileDelete = async (req,res) => {
    try {
        const getCheck = await Cauth.getAuthCheck(req,res);
        if(!getCheck){
            res.redirect('/')
            return;
        }
        const cookieValue = req.signedCookies.logined.id;
        console.log(cookieValue)
        const userId = await Cauth.stringToUuid(cookieValue);
        
        const user = await User.findOne({ where: { user_id: userId } });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.render('profileDelete', { user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const findPw = async (req,res) => {
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/')
        return;
    }
    res.render('findpw')
}
////////////POST//////////////
const profileUpdatePost = async (req,res)=>{
    try {
        const {id,nick,email} = req.body

        const update = await User.update({nickname : nick, email,}, {where : {user_id : id}})
        res.json({result : true})

    } catch (error) {
        console.log(error)
    }
}

const pwUpdatePost = async (req,res)=>{
    try {
        const {id, login_id, login_pw, Cpw, pw_edit, pw_edit2,} = req.body
        
        const hashPwEdit = await Cauth.pwHashing(pw_edit)
        const pwCompare = await bcrypt.compare(Cpw,login_pw)
        //console.log(pwCompare) 

        if(pwCompare && pw_edit === pw_edit2) {
            const update = await User.update({login_pw : hashPwEdit}, {where : {user_id : id}})
            res.json({result : true})
        } else if(!pwCompare && pw_edit === pw_edit2) {
            res.json({result : false, message : '비밀번호가 틀립니다'})
        } else if(pwCompare && pw_edit !== pw_edit2) {
            res.json({result : false, message : '비밀번호가 서로 다릅니다'})
        } else {
            res.json({result : false, message : '작성한 내용을 확인해주세요'})
        }
    } catch (error) {
        console.log(error)
    }
}

const profileDeletePost = async (req,res) => {
    try {
        const {id, login_id, login_pw, Cid, Cpw,} = req.body

        const pwCompare = await bcrypt.compare(Cpw,login_pw)

        if(pwCompare && login_id === Cid) {
            const destroy = await User.destroy({where : {user_id : id}})
            res.json({result : true})
        } else if(!pwCompare && login_id === Cid) {
            res.send({result : false, message : '비밀번호가 틀립니다.'})
        } else {
            res.send({result : false, message : '존재하지 않는 회원입니다.'})
        }
    } catch (error) {
        console.log(error)
    }
}

//본인인지 확인 후 임시 해쉬 비밀번호를 DB에 저장, 가입시 입력한 email로 임시 비번 발송
const findInfoPost = async (req,res) =>{ 
    try {
        const {login_id, name} = req.body
        const user = await User.findOne({attributes: ["email","user_name"] , where:{login_id} , raw:true})
        if(!user){
            res.send({result : false,  message : '존재하지 않는 회원입니다.'})
        }
        if(user.user_name === name){
            const email = user.email

            const password = crypto.randomBytes(8).toString('base64')
            const hash = await Cauth.pwHashing(password)

            const update = await User.update({login_pw : hash},{where : {login_id}}) 
            
            let emailParam = {
                toEmail: email,     // 수신할 이메일
            
                subject: `${login_id} 님 비밀번호 찾기 안내`,   // 메일 제목
            
                text: `${name} 님의 임시 비밀번호
${password}
로그인 시 비밀번호를 변경해 주세요. `  // 메일 내용, 들여쓰기도 공백으로 치기 때문에 옆으로 밀어놨어요
              };
            
              mailer.sendGmail(emailParam);
              
              res.send({result : true, message : '계정에 입력한 email로 임시 비밀번호 발급 완료'})
        }else {
            res.send({result : false,  message : '아이디와 이름을 확인해주세요'})
        }  
    } catch (error) {
        console.log(error)
    }
}

const findPwPost = (req, res) => { // /mail 에서 받는 포스트
    const { email }  = req.body;
  
    let emailParam = {
      toEmail: email,     // 수신할 이메일
  
      subject: '회원님 비밀번호 찾기 안내',   // 메일 제목
  
      text: `메일테스트`  // 메일 내용
    };
  
    mailer.sendGmail(emailParam);
  
    res.status(200).send("성공");
  }


module.exports ={
    profileUpdate,
    pwUpdate,
    profileDelete,
    findPw,
    profileUpdatePost,
    pwUpdatePost,
    profileDeletePost,
    findInfoPost,
    findPwPost,
}


