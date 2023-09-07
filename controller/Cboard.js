const {
    Board,
} = require('../models');

const {stringToUuid} = require('./Cauth');

const boardList = (req,res)=>{
    res.render('boardList');
}

const create_board = (req,res)=>{
    res.render('postNew');
}

const edit_board = (req,res)=>{
    res.render('postEdit');
}



 const user_id = '231cc155-a8b7-4809-8432-efa38c0ff057';

const create_board_post = async (req,res)=>{
    const {title,content,event_time,bord_category} = req.body
    // user_id는 쿠키를 생성해서 req.cookies로 가져와야 될거 같긴 한데
    // 백앤드로 관계형 잘 설정되는지만 보려고 일단은 req에 같이 넣음
    try {
        const board = await Board.create({
            title,
            poster_id : user_id,
            content,
            event_time,
            bord_category
        })
       if(board){
            res.json({result:true , title , content, event_time, bord_category});
       }else{
            res.json({result:false});
       }
    } catch(e){
        res.json({result:false});
        console.log(e);
    }
}
const edit_board_post = async(req,res)=>{
    const {id, title,content,event_time,bord_category} = req.body
    try{
        const board = await Board.update({
            title,
            poster_id : user_id,
            content,
            event_time,
            bord_category
        },{
            where:{id}
        })
        if(board.dataValues){
            res.json({result:true , title , content, event_time, bord_category});
        }else{
            res.json({result:false});
        }
       
    }catch(e){
        res.json({result:false});
        console.log(e);
    }
}
const delete_board = async (req, res) => {

    const { id } = req.body;
    
    try {
        const board = await Board.destroy({ where : { id }})
        if (board) {
            res.json({result:true});
        } else {
            res.json({result:false});
        } 
        
    } catch (e) {
        res.json({result:false});
        console.log(e);
    }

}

const boarduser_findone = async(req,res)=>{

    const {id} = req.body;

    try {
        
        const board = await Board.findOne({
            attributes:['id', 'title', 'views', 'content', 'event_time', 'bord_category', 'createdAt'],
            where: {id}
        })
        if (board.dataValues){
            res.json({result:true,board});
        }else{
            res.json({result:false});
        }   
      
    } catch(e) {
        res.json({result:false});
        console.log(e);
    }
}

const boarduser_findall = async(req,res)=>{
    const test = await stringToUuid(req.signedCookies['logined'].id);
   
    console.log("cookie",test);
    const {id} = req.body;
    console.log("id",id);
    try{
        const board = await Board.findAll({
            attributes:['id', 'title', 'views', 'content', 'event_time', 'bord_category', 'createdAt', 'poster_id'],
            limit:3
        })
        console.log("id",id);
        if(board){
            let poster_chk= false;
            
            board.forEach(e => {
               
                const chk_id = e.dataValues.poster_id;
                console.log("test",test);
                console.log("chk_id",chk_id);
                if(test === chk_id){
                    console.log("본인 게시물")
                    e.dataValues.poster_chk=true;
                }else{
                    console.log("남의 게시물");
                    e.dataValues.poster_chk=false;
                }
            });
            res.json({result:true,board});
        }else{
            res.json({result:false});
        }
    }catch(e){
        res.json({result:false});
        console.log(e);
    }
}


module.exports = {
    create_board,
    create_board_post,
    edit_board,
    edit_board_post,
    delete_board,
    boardList,
    boarduser_findone,
    boarduser_findall,
}