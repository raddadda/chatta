const { Chat_Room, Chat_Room_Join, Chat_Message, User } = require('../models');
const Cauth = require('./Cauth');

const chatRoomJoin = async (req,res) => {
    try {
        const user_id = await Cauth.stringToUuid(req.signedCookies.logined.id);
        const { room_id } = req.body
        const chat_room_join_check = await Chat_Room_Join.findOne({ attributes: ["room_id"], where: { user_id, room_id}, raw: true })
        if (chat_room_join_check){
            res.json({result: false})
            return;
        }
        const chat_room_join = await Chat_Room_Join.create({
            user_id,
            room_id
        });
        res.json({ result: true }) 
    } catch (error) {
        console.log(error);
    }
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
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/login')
        return;
    }
    const {room_id, category} = req.query
    const { id, nickname } = req.signedCookies.logined
    const user_id = await Cauth.stringToUuid(id)
    res.render('chatRoom',{ user_id, nickname, room_id, category });
}

const memberLoad = async (req,res) => {
    const {room_id} = req.body
    const member_list = await Chat_Room_Join.findAll({ attributes: ['user_id'], where: { room_id }, raw: true })
    let memberInfoList = [];
    for(let i =0; i < member_list.length; i++ ){
        const memberInfo = await User.findOne({attributes: ['user_id','nickname'], where:{user_id:member_list[i].user_id},raw:true})
        memberInfoList.push(memberInfo);
    }
    res.json({result: true , memberInfoList})
}

const msgLoad = async (req,res) => {
    const {room_id} = req.body
    const msg_list = await Chat_Message.findAll({ attributes: ['user_id','content','createdAt'], where: { room_id }, raw: true })
    res.json({result: true , msg_list})
}

const msgSend = async (req,res) => {
    const {user_id,nickname,room_id,content} = req.body
    const msg_send = await Chat_Message.create({
        user_id,
        room_id,
        content,
    })
    res.json({
        result: true,
        user_id,
        nickname,
        room_id,
        content,
    })
}

module.exports = {
    chatRoomJoin,
    myChatRoomList,
    chatRoomMain,
    memberLoad,
    msgLoad,
    msgSend,
}