const { DataTypes } = require('sequelize');

const Board = (sequelize) => {
    return sequelize.define('board', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    
        poster_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING(500),
        },
        event_time: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        board_img: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: 'https://kdt9-justin.s3.ap-northeast-2.amazonaws.com/pi_1280.jpg',
        }
    },
        {
            freezeTableName: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
}

module.exports = Board;