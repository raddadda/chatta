const {DataTypes} = require('sequelize');

const Chat_Room = (sequelize) =>{
    return sequelize.define('chat_room',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        owner_id:{
            type:DataTypes.UUID,
            allowNull:false,
        },
        board_id:{
            type:DataTypes.INTEGER,
        },
        room_title:{
            type:DataTypes.STRING(20),
            allowNull:false,
        },
        category:{
            type:DataTypes.STRING(20),
            allowNull:false,
        },
        headcount:{
            type:DataTypes.INTEGER,
            defaultValue:0,
        },
    },
    {
        freezeTableName:true,
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci'
        // charset, collate가 없으면 uuid를 foriengnKey로 받는게 오류남..
    })
}

module.exports = Chat_Room;