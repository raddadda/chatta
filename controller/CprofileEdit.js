const { User } = require('../models');
const { v4 } = require('uuid');
const constant = require('../common/constant');
const Cauth = require('./Cauth');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mailer = require('../routes/mail');

///////////GET////////////
const profileUpdate = async (req, res) => {
    try {
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


////////////POST//////////////
const profileUpdatePost = async (req,res)=>{
    try {
        const {id,nick} = req.body

        const update = await User.update({nickname : nick}, {where : {user_id : id}})
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
            res.send({message : '비밀번호가 틀립니다'})
        } else if(pwCompare && pw_edit !== pw_edit2) {
            res.send({message : '비밀번호가 서로 다릅니다'})
        } else {
            res.send({message : '작성한 내용을 확인해주세요'})
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
            res.send({message : '비밀번호가 틀립니다.'})
        } else {
            res.send({message : '존재하지 않는 회원입니다.'})
        }
    } catch (error) {
        console.log(error)
    }
}

const findPwPost = (req, res) => {
    const { email }  = req.body;
  
    let emailParam = {
      toEmail: email,     // 수신할 이메일
  
      subject: 'New Email From Gyunny',   // 메일 제목
  
      text: `Gyunny 회원님!`  // 메일 내용
    };
  
    mailer.sendGmail(emailParam);
  
    res.status(200).send("성공");
  }


module.exports ={
    profileUpdate,
    pwUpdate,
    profileDelete,
    profileUpdatePost,
    pwUpdatePost,
    profileDeletePost,
    findPwPost,
}


