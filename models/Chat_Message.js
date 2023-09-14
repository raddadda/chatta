const { DataTypes } = require('sequelize');

const Chat_Message = (sequelize) => {
    return sequelize.define('chat_message', {
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
        content: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

    },
        {
            freezeTableName: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
}

module.exports = Chat_Message;