'use strict';

const Sequelize = require('sequelize');
const config = require(__dirname + '/../config/config.json')['development'];
const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config
    // process.env.DB_DATABASE,
    // process.env.DB_USER,
    // process.env.DB_PASSWORD,
    // {
    //     host: process.env.DB_HOST,
    //     dialect: 'mysql',
    // }
);

db.User = require('./User')(sequelize);
db.Friend_List = require('./Friend_List')(sequelize);
db.Board = require('./Board')(sequelize);
db.Board_Bookmark = require('./Board_Bookmark')(sequelize);
db.Chat_Room = require('./Chat_Room')(sequelize);
db.Chat_Room_Join = require('./Chat_Room_Join')(sequelize);
db.Chat_Message = require('./Chat_Message')(sequelize);


db.User.hasMany(db.Friend_List, { foreignKey: 'user_id' });
db.Friend_List.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' })
db.Friend_List.belongsTo(db.User, { foreignKey: 'friend_id', onDelete: 'CASCADE' })
// user_id랑 friend_id 모두 user 데이터 베이스와 연결된 값이라서 


db.User.hasMany(db.Board, { foreignKey: 'poster_id' });
db.Board.belongsTo(db.User, { foreignKey: 'poster_id', onDelete: 'CASCADE' })
// 유저 - 게시판 의   1:다 관계  (작성한 게시판)


db.User.hasMany(db.Board_Bookmark, { foreignKey: 'user_id' });
db.Board.hasMany(db.Board_Bookmark, { foreignKey: 'board_id' })
db.Board_Bookmark.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Board_Bookmark.belongsTo(db.Board, { foreignKey: 'board_id', onDelete: 'CASCADE' })
// 유저 - 북마크 게시판 - 게시판 의    다:다 관계   (북마크 게시판)


db.User.hasMany(db.Chat_Room_Join, { foreignKey: 'user_id' });
db.Chat_Room.hasMany(db.Chat_Room_Join, { foreignKey: 'room_id' })
db.Chat_Room_Join.belongsTo(db.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
db.Chat_Room_Join.belongsTo(db.Chat_Room, { foreignKey: 'room_id', onDelete: 'CASCADE' })
// 유저 - 채팅방 참여자 - 채팅방 의    다:다 관계   (채팅방 참여자)

db.Board.hasOne(db.Chat_Room, { foreignKey: 'room_id' });
db.Chat_Room.belongsTo(db.Board, { foreignKey: 'room_id', onDelete: 'CASCADE' })


db.User.hasMany(db.Chat_Message, { foreignKey: 'user_id' })
db.Chat_Room.hasMany(db.Chat_Message, { foreignKey: 'room_id' })
db.Chat_Message.belongsTo(db.User, { foreignKey: 'user_id' });
db.Chat_Message.belongsTo(db.Chat_Room, { foreignKey: 'room_id', onDelete: 'CASCADE' })
//유저 - 채팅 메시지 - 채팅방 의   다:다 관계   (채팅 메시지)


db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;