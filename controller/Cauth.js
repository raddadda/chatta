const {User} = require('../models');
const bcrypt = require('bcrypt');

const dbIdCheck = async (login_id) => {
    const result = await User.findAll({where:{login_id}})
    if(result.length > 0){
        return false;
    } else {
        return true;
    }
}

const dbIdSearch = async (login_id) =>{
    const user = await User.findAll({where:{login_id}})
    return user
}

const pwHashing = async (pw) => {
    const hash = await bcrypt.hash(pw,10)
    return hash;
}

const dbpwCompare = async (pw,dbpw) => {
    const flag = await bcrypt.compare(pw,dbpw);
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

module.exports = {
    dbIdCheck,
    dbIdSearch,
    pwHashing,
    dbpwCompare,
    uuidToString,
    stringToUuid,
}