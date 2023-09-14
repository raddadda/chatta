const { DataTypes } = require('sequelize');

const Chat_Room = (sequelize) => {
    return sequelize.define('chat_room', {
        room_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        poster_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        event_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        headcount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
        {
            freezeTableName: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
}

module.exports = Chat_Room;