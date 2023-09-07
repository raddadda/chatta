const {
    Board,
} = require('../models');

const newMain = (req,res)=>{
    res.render('new');
}

const newEdit = (req,res)=>{
    res.render('postedit');
}


const user_id = '296b63ea-6f1c-4f18-9f10-382f4a80e1cd';

const boardPost = async (req,res)=>{
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
const boardEdit = async(req,res)=>{
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
const boardDelete = async (req, res) => {

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
    const {id} = req.body;
    console.log("id",id);
    try{
        const board = await Board.findAll({
            attributes:['id', 'title', 'views', 'content', 'event_time', 'bord_category', 'createdAt'],
            limit:3
        })
        if(board){
            res.json({result:true,board});
        }else{
            res.json({result:false});
        }
    }catch(e){
        es.json({result:false});
        console.log(e);
    }
}


module.exports = {
    newMain,
    newEdit,
    boardPost,
    boardEdit,
    boarduser_findone,
    boarduser_findall,
    boardDelete
}