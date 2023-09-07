const { User } = require('../models');
const { v4 } = require('uuid');
const constant = require('../common/constant');
const Cauth = require('./Cauth');
const bcrypt = require('bcrypt');

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

const post_profileUpdate = async (req,res)=>{
    try {
        const {id,nick} = req.body

        const update = await User.update({nickname : nick}, {where : {user_id : id}})
        res.json({result : true})

    } catch (error) {
        console.log(error)
    }
}

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

const post_pwUpdate = async (req,res)=>{
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

module.exports ={
    profileUpdate,
    post_profileUpdate,
    pwUpdate,
    post_pwUpdate
}


