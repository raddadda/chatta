const { DataTypes } = require('sequelize');

const Chat_Room_Join = (sequelize) => {
    return sequelize.define('chat_room_join', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
            freezeTableName: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
}

module.exports = Chat_Room_Join;