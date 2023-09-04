const {User,Board,Board_Bookmark} = require('../models');
const { v4 } = require('uuid');
let uuid;

const main = (req,res)=>{
    res.render('index');
}

const newMain = (req,res)=>{
    res.render('new');
}

const boardPost = async (req,res)=>{
    const {title,views,user_id} = req.body
    console.log(uuid);
    // user_id는 쿠키를 생성해서 req.cookies로 가져와야 될거 같긴 한데
    // 백앤드로 관계형 잘 설정되는지만 보려고 일단은 req에 같이 넣음
    const board = await Board.create({
        title,
        views,
        poster_id:uuid,
    })
    res.json({result:true});
}

const bookmarkPost = async (req,res)=>{
    const {board_id}=req.body;
    const bookmark = await Board_Bookmark.create({
        user_id:uuid,
        board_id,
    })
    res.json({result:true});
}

const deleteUser = async (req,res)=>{
    const result = await User.destroy({
        where:{user_id:uuid}
    })
    res.send({result:true});
}

const deleteBoard = async (req,res)=>{
    const result = await Board.destroy({
        where:{id:req.body.id}
    })
    res.send({result:true});
}
// 외래키 연결이 잘 된건지 확인을 위해..


const connection = (io,socket,loc)=>{
    socket.on('userLog',()=>{
        console.log(`${loc}접속`)
    })
}
// 새로운 함수를 정의하는게 아닌 이 안에 모두 동작 함수를 넣어야함

module.exports = {
    main,
    newMain,
    connection,
    boardPost,
    bookmarkPost,
    deleteUser,
    deleteBoard,
}