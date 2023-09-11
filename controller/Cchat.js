const { Chat_Room,Chat_Room_Join } = require('../models');
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

const myChatRoomList = async (req,res) => {
    const user_id = await Cauth.stringToUuid(req.body.user_id) 
    const list = await Chat_Room_Join.findAll({ attributes: ["room_id"], where: { user_id }, raw: true })
    let roomInfoList = [];
    for(let i =0; i < list.length; i++ ){
        const roomInfo = await Chat_Room.findOne({where:{room_id:list[i].room_id},raw:true})
        roomInfoList.push(roomInfo);
    }
    res.json({ result: true, roomInfoList});
}

const chatRoomMain = async (req,res) => {
    res.render('chatRoom')
}

module.exports = {
    chatRoomJoin,
    myChatRoomList,
    chatRoomMain,
}