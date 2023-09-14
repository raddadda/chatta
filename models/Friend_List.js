const { DataTypes } = require('sequelize');

const Friend_List = (sequelize) => {
    return sequelize.define('friend_list', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        friend_id: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
    })
}

module.exports = Friend_List;