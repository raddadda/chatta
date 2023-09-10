const { Chat_Room_Join } = require('../models');
const Cauth = require('./Cauth');

const chatRoomJoin = async (req,res) => {
    const user_id = await Cauth.stringToUuid(req.signedCookies.logined.id);
    console.log("data",req.body);
    const { room_id } = req.body
    const chat_room_join = await Chat_Room_Join.create({
        user_id,
        room_id
    });
    res.json({ result: true })
}

const myChatRoomList = async (user_id) => {
    const list = Chat_Room_JoinfindAll({ attributes: ["room_id"], where: { user_id }, raw: true })
    console.log('list',list);
}

module.exports = {
    chatRoomJoin,
    myChatRoomList,
}