const {
    Board,
    Sequelize,
    Chat_Room
} = require('../models');

const Op = Sequelize.Op;

const Cauth = require('./Cauth');

// res.cookies(signedCookies) id값 복호화
const getUserId = async (req) => {

    if (req.signedCookies && req.signedCookies['logined'] && req.signedCookies['logined'].id) {
        console.log('cookie', req.signedCookies['logined'].id);
        return uuid = await Cauth.stringToUuid(req.signedCookies['logined'].id);
    } else {
        return ''
    }
}

const boardList = async (req, res)=>{
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/')
        return;
    }
    res.render('boardList');
}

const create_board = async (req, res)=>{
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/')
        return;
    }
    res.render('postNew');
}

const edit_board = async (req, res)=>{
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/')
        return;
    }
    res.render('postEdit');
}

const create_board_post = async (req,res)=>{

    const user_id = await getUserId(req);

    const {title,content,event_time,category} = req.body
    // user_id는 쿠키를 생성해서 req.cookies로 가져와야 될거 같긴 한데
    // 백앤드로 관계형 잘 설정되는지만 보려고 일단은 req에 같이 넣음
    try {
        const board = await Board.create({
            title,
            poster_id : user_id,
            content,
            event_time,
            category,
        })
        if(board){
            res.json({result:true , title , content, event_time, category});
        } else {
            res.json({result:false});
        }
    } catch(e){
        res.json({result:false});
        console.log(e);
    }
}
const edit_board_post = async(req,res)=>{

    const user_id = await getUserId(req);

    const {id, title,content,event_time,category} = req.body

    try{
        const board = await Board.update({
            title,
            poster_id : user_id,
            content,
            event_time,
            category
        },{
            where:{id}
        })
        if(board.dataValues){
            res.json({result:true , title , content, event_time, category});
        }else{
            res.json({result:false});
        }
       
    }catch(e){
        res.json({result:false});
        console.log(e);
    }
}
const delete_board = async (req, res) => {

    const user_id = await getUserId(req);
    if (user_id === '') return res.json({result:false});

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

const boarduser_findone = async (req,res)=>{

    const {id} = req.body;

    try {
        const board = await Board.findOne({
            attributes:['id', 'title', 'views', 'content', 'event_time', 'category', 'createdAt'],
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
    
    const user_id = await getUserId(req);
   
    try {
        const board = await Board.findAll({
            limit:3
        })

        if(board){
            board.forEach(index => {
                if (index.dataValues.poster_id === user_id) {
                    index.dataValues.poster_check = true;
                    delete index.dataValues.poster_id;
                } else {
                    index.dataValues.poster_check = false;
                    delete index.dataValues.poster_id;
                }
            });
            
            res.json({result:true, board});
        }else{
            res.json({result:false});
        }
    }catch(e){
        res.json({result:false});
        console.log(e);
    }
}

const boarduser_findall_pagenation = async (req, res)=>{
    
    console.log('body', req.body);
    const user_id = await getUserId(req);
    
    let pagenation = {};
    let boardRowlimit = 3; 

    if (req.body.page_id) {
        pagenation.startid = {id :{ [Op.gte]: req.body.page_id}}

    } else {
        pagenation.startid = {id :{[Op.gte]: 1}}
    }


    try {
        const board = await Board.findAll({
            where: pagenation.startid,
            limit : boardRowlimit
        })

        if (board){
            board.forEach(index => {
                if (index.dataValues.poster_id === user_id) {
                    index.dataValues.poster_check = true;
                    delete index.dataValues.poster_id;
                } else {
                    index.dataValues.poster_check = false;
                    delete index.dataValues.poster_id;
                }
            });
            
            res.json({result:true, board});
        } else{
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
    boarduser_findall_pagenation
}