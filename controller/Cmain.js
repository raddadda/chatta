const {
    User,
    Board,
    Board_Bookmark,
    Friend_List,
    Chat_Room,
    Chat_Room_Join,
    Chat_Message
} = require('../models');
const Cauth = require('./Cauth');

const main = async (req,res)=>{
    const getCheck = await Cauth.getAuthCheck(req, res);
        if (!getCheck) {
            res.redirect('/login')
            return;
    }
    res.render('index');
}

const loginMain = async (req,res)=>{
    console.log("cookie",req.signedCookies);
    const {logined} = req.signedCookies;
    if (logined){
        const getCheck = await Cauth.getAuthCheck(req, res);
        if (getCheck) {
            res.redirect('/')
        }
    }
    res.render('login');
}



const newMain = async (req,res)=>{
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/login')
        return;
    }
    res.render('index');
}

const myChatMain = async (req,res)=>{
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/login')
        return;
    }
    const { id, nickname } = req.signedCookies.logined
    res.render('chatRoomList',{ id, nickname });
}

const bookmarkPost = async (req,res)=>{
    const {user_id,board_id}=req.body;
    const bookmark = await Board_Bookmark.create({
        user_id,
        board_id,
    })
    res.json({result:true , message:`${user_id}님이 ${board_id}를 북마크 했습니다`});
}


const friendListPost = async (req,res)=>{
    const {user_id,friend_id} = req.body;
    const friendlist = await Friend_List.create({
        user_id,
        friend_id,
    })
    res.json({result:true , message:`${user_id}님이 ${friend_id}님을 친구 추가 하셨습니다`});
}


const chatRoomPost = async (req,res)=>{
    const {user_id,board_id,title,category}=req.body;
    const chatroom = await Chat_Room.create({
        poster_id:user_id,
        board_id,
        title,
        category,
    })
    res.json({result:true,chatroom});
}


const chatRoomJoinPost = async (req,res)=>{
    const {user_id,room_id}=req.body;
    const chatroomjoin = await Chat_Room_Join.create({
        user_id,
        room_id,
    })
    res.json({result:true,chatroomjoin});
}


const chatMessagePost = async (req,res)=>{
    const {user_id,room_id,content}=req.body;
    const chat_message = await Chat_Message.create({
        user_id,
        room_id,
        content,
    })
    res.json({result:true,chat_message});
}


const deleteUser = async (req,res)=>{
    const {user_id} = req.body 
    const dest = await User.destroy({
        where:{user_id}
    })
    res.send({result:true,dest});
}


const deleteBoard = async (req,res)=>{
    const {board_id:id} = req.body
    const dest = await Board.destroy({
        where:{id}
    })
    res.send({result:true,dest});
}
// 외래키 연결이 잘 된건지 확인을 위해..


const deleteFriend = async (req,res)=>{
    const {friend_list_id:id} = req.body
    const dest = await Board.destroy({
        where:{id}
    })
    res.send({result:true,dest});
}


const deleteChatRoom = async (req,res)=>{
    const {chat_room_id:id} = req.body
    const dest = await Chat_Room.destroy({
        where:{id}
    })
    res.send({result:true,dest});
}


const deleteChatRoomJoin = async (req,res)=>{
    const {chat_room_join_id:id} = req.body
    const dest = await Chat_Room_Join.destroy({
        where:{id}
    })
    res.send({result:true,dest});
}


const deleteChatMessage = async (req,res)=>{
    const {chat_message_id:id} = req.body
    const dest = await Chat_Message.destroy({
        where:{id}
    })
    res.send({result:true,dest});
}


// 새로운 함수를 정의하는게 아닌 이 안에 모두 동작 함수를 넣어야함

module.exports = {
    main,
    loginMain,
    newMain,
    myChatMain,
    bookmarkPost,
    chatRoomPost,
    chatRoomJoinPost,
    chatMessagePost,
    friendListPost,
    deleteUser,
    deleteBoard,
    deleteFriend,
    deleteChatRoom,
    deleteChatRoomJoin,
    deleteChatMessage,
}