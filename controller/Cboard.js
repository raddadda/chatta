const {
    Board,
    Sequelize,
    Chat_Room,
    Board_Bookmark
} = require('../models');

const Op = Sequelize.Op;

const Cauth = require('./Cauth');

let imgArray = new Array();
    imgArray[0] = "https://kdt9-justin.s3.ap-northeast-2.amazonaws.com/pi_1280.jpg";
	imgArray[1] = "https://kdt9-justin.s3.ap-northeast-2.amazonaws.com/football_1280.jpg";
	imgArray[2] = "https://kdt9-justin.s3.ap-northeast-2.amazonaws.com/arm-wrestling_1280.jpg";
	imgArray[3] = "https://kdt9-justin.s3.ap-northeast-2.amazonaws.com/moon_1280.jpg";

const random_choice_img_url = async()=>{
        let imgNum = await Math.round(Math.random()*3);
		return imgArray[imgNum];
}
// res.cookies(signedCookies) id값 복호화
const getUserId = async (req) => {
    try {
        if (req.signedCookies && req.signedCookies['logined'] && req.signedCookies['logined'].id) {
            return uuid = await Cauth.stringToUuid(req.signedCookies['logined'].id);
        } else {
            return ''
        }
    } catch (error) {
        console.log(error)
    }
}


const create_board = async (req, res)=>{
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/login')
        return;
    }
    res.render('postNew');
}

const edit_board = async (req, res)=>{
    const getCheck = await Cauth.getAuthCheck(req, res);
    if (!getCheck) {
        res.redirect('/login')
        return;
    }
    res.render('postEdit');
}

const create_board_post = async (req,res)=>{
    try {
        const user_id = await getUserId(req);
        const board_img = await random_choice_img_url()
        const {title,content,event_time,category} = req.body

        const board = await Board.create({
            title,
            poster_id : user_id,
            content,
            event_time,
            category,
            chat_room : {
                title,
                poster_id : user_id,
                category,
                event_time,
            },
            board_img
        },{
            include:Chat_Room,
        })
        if(board){
            res.json({result:true , title , content, event_time, category});
            return;
        } else {
            res.json({result:false});
            return;
        }
    } catch(error){
        res.json({result:false});
        console.log(error);
    }
}

const edit_board_post = async(req,res)=>{
    try{
        const user_id = await getUserId(req);
        const {id, title,content,event_time,category} = req.body
        const board = await Board.update({
            title,
            poster_id : user_id,
            content,
            event_time,
            category
        },{
            where:{id}
        })
        const chat = await Chat_Room.update({
            title,
            poster_id : user_id,
            event_time,
            category
        },{
            where:{room_id:id}
        })
        if(board){
            res.json({result:true , title , content, event_time, category});
            return;
        }else{
            res.json({result:false});
            return;
        }
    }catch(error){
        res.json({result:false});
        console.log(error);
    }
}
const delete_board = async (req, res) => {
    try {
        const { id } = req.body;
        const board = await Board.destroy({ where : { id }});
        const bookmark = await Board_Bookmark.destroy({ where : {id}});
        if (board) {
            res.json({result:true});
            return;
        } else {
            res.json({result:false});
            return;
        } 
    } catch (error) {
        res.json({result:false});
        console.log(error);
    }
}

const boarduser_findone = async (req,res)=>{
    try {
        const {id} = req.body;
        const board = await Board.findOne({
            attributes:['id', 'title', 'views', 'content', 'event_time', 'category', 'createdAt','board_img'],
            where: {id}
        })
        if (board && board.dataValues){
            res.json({result:true, board});
            return;
        }else{
            res.json({result:false});
            return;
        }   
    } catch(error) {
        res.json({result:false});
        console.log(error);
    }
}

const boarduser_findall = async(req,res)=>{
    try {
        const user_id = await getUserId(req);
        const board = await Board.findAll({
            order: [["id","desc"]],
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
            return;
        }else{
            res.json({result:false});
            return;
        }
    } catch(error){
        res.json({result:false});
        console.log(error);
    }
}

const boarduser_findall_pagenation = async (req, res)=>{
    try {
        const user_id = await getUserId(req);
        let pagenation = {};
        let boardRowlimit = 12; 
        if (req.body.page_id) {
            pagenation.startid = {id :{ [Op.lt]: req.body.page_id-1}}
        } else {
            pagenation.startid = {id :{[Op.gte]: 1}}
        }
        const board = await Board.findAll({
             order: [["id","desc"]],
            where: pagenation.startid,
            limit : boardRowlimit
        })
        if (board) {
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
            return;
        } else{
            res.json({result:false});
            return;
        }
    } catch(error){
        res.json({result:false});
        console.log(error);
    }
}

const create_board_bookmark = async (req, res)=>{
    try {
            const user_id = await getUserId(req);
            const { board_id, view } = req.body;
            const board = await Board_Bookmark.create({
                user_id: user_id,
                board_id:board_id
            })
            const findone = await Board.update({views: view+1},{where: {id:board_id} })
            if(board){
                res.json({result:true});
                return;
            } else {
                res.json({result:false});
                return;
            }
        } catch(error) {

            res.json({result:false});
            console.log(error);

        }
}
const delete_board_bookmark = async (req, res)=>{
    try {
        const user_id = await getUserId(req);
        const { board_id , view} = req.body;
        const board = await Board_Bookmark.destroy({ where : { board_id, user_id }});
        const findone = await Board.update({views: view-1},{where: {id:board_id} })
        if (board) {
            res.json({result:true});
            return;
        } else {
            res.json({result:false});
            return;
        }
        } catch(e){
            res.json({result:false});
            console.log(e);
        }
}

const findone_board_bookmark = async (req,res)=>{

    try {
        const {board_id} = req.body;
        const user_id = await getUserId(req);
        const board = await Board_Bookmark.findOne({
            // attributes:['id', 'title', 'views', 'content', 'event_time', 'category', 'createdAt'],
            where: { board_id, user_id }
        })
        if (board && board.dataValues){
            res.json({result:true });
            return;
        }else{
            res.json({result:false});
            return;
        }   
    } catch(error) {
        res.json({result:false});
        console.log(error);
    }
}


const findall_profile_bookmark_board =  async (req,res)=>{
    try {
        const user_id = await getUserId(req);
        const board = await Board_Bookmark.findAll({
            include: [{
                model: Board,
                attributes:['title','category','event_time','views','content','id','poster_id','board_img'],
                where: {
                     poster_id: user_id,
                }
            }]
        })
        if (board) {
            board.forEach(index => {
                console.log('index', index.dataValues.board)
                if (index.dataValues.board.dataValues.poster_id === user_id) {
                    index.dataValues.board.dataValues.poster_check = true;
                    delete index.dataValues.board.dataValues.poster_id;
                } else {
                    index.dataValues.board.dataValues.poster_check = false;
                    delete index.dataValues.board.dataValues.poster_id;
                }
            });
            res.json({result:true, board});
            return;
        } else{
            res.json({result:false});
            return;
        }
    } catch(error){
        res.json({result:false});
        console.log(error);
    }
}


module.exports = {
    create_board,
    create_board_post,
    edit_board,
    edit_board_post,
    delete_board,
    boarduser_findone,
    boarduser_findall,
    boarduser_findall_pagenation,
    findone_board_bookmark,
    create_board_bookmark,
    delete_board_bookmark,
    findall_profile_bookmark_board
}