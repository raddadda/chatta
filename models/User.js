const {DataTypes} = require('sequelize');

const User = (sequelize) =>{
    return sequelize.define('user',{
        user_id:{
            type:DataTypes.UUID,
            primaryKey:true,
            allowNull:false,
        },
        login_id:{
            type:DataTypes.STRING(20),
            allowNull:false,
        },
        login_pw:{
            type:DataTypes.STRING(100),
            allowNull:false,
        },
        nickname:{
            type:DataTypes.STRING(20),
        },
        user_name:{
            type:DataTypes.STRING(20),
        },
        gender:{
            type:DataTypes.STRING(10),
        },
        birth:{
            type:DataTypes.DATEONLY,
        },
        islogin:{
            type:DataTypes.BOOLEAN,
            defaultValue:true,
        },
        auth:{
            type:DataTypes.STRING(88),
        },
        auth_num:{
            type:DataTypes.INTEGER,
        },
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

module.exports = User;