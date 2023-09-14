const { DataTypes } = require('sequelize');

const Board_Bookmark = (sequelize) => {
    return sequelize.define('board_bookmark', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        board_id: {
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

module.exports = Board_Bookmark;