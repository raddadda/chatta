const {
    Board,
} = require('../models');

const newMain = (req,res)=>{
    res.render('new');
}
const user_id='296b63ea-6f1c-4f18-9f10-382f4a80e1cd';

const boardPost = async (req,res)=>{
    const {title,content,event_time,bord_category} = req.body
    // user_id는 쿠키를 생성해서 req.cookies로 가져와야 될거 같긴 한데
    // 백앤드로 관계형 잘 설정되는지만 보려고 일단은 req에 같이 넣음
    try{
        const board = await Board.create({
            title,
            poster_id : user_id,
            content,
            event_time,
            bord_category
        })
        res.json({result:true , title , content, event_time, bord_category});
    }catch(e){
        console.log(e);
    }
}

const boardEdit = async(req,res)=>{
    const {title,content,event_time,bord_category} = req.body
    try{
        const board = await Board.update({
            title,
            poster_id : user_id,
            content,
            event_time,
            bord_category
        },{
            where:{poster_id : user_id}
        })
        res.json({result:true , title , content, event_time, bord_category});
    }catch(e){
        console.log(e);
    }
}
const boarduser_findall = async(req,res)=>{
    
    try{
        const board = await Board.findAll({
            where: user_id
        })
        res.json({result:true});
    }catch(e){
        console.log(e);
    }
}
module.exports = {
    newMain,
    boardPost,
    boardEdit,
    boarduser_findall
}