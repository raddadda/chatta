const {DataTypes} = require('sequelize');

const Board = (sequelize) =>{
    return sequelize.define('board',{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            allowNull:false,
            autoIncrement:true,
        },
        title:{
            type:DataTypes.STRING(20),
            allowNull:false,
        },
        views:{
            type:DataTypes.INTEGER,
            allowNull:false,
            defaultValue:0,
        },
        poster_id:{
            type:DataTypes.UUID,
            allowNull:false,
        },
        content:{
            type:DataTypes.STRING(100),
        }
    },
    {
        freezeTableName:true,
        charset : 'utf8mb4',
        collate : 'utf8mb4_general_ci'
        // charset, collate가 없으면 uuid를 foriengnKey로 받는게 오류남..
    })
}

module.exports = Board;