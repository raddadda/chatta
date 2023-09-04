const {DataTypes} = require('sequelize');

const Friend_List = (sequelize) =>{
    return sequelize.define('friend_list',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true,
        },
        user_id:{
            type:DataTypes.UUID,
            allowNull:false,
        },
        friend_id:{
            type:DataTypes.UUID,
            allowNull:false,
        }
        // 굳이 양쪽 방향 하나씩 만드는거보다 관계 느낌으로 하나만 만들어도 될듯
    },
    {
        // tableName:'user',
        freezeTableName:true,
        // timestamps:true,
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci',
        // charset, collate가 없으면 uuid를 foriengnKey로 받는게 오류남..
    })
}

module.exports = Friend_List;