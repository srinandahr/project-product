const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const DSA = sequelize.define('DSA', {
    topic: { type: DataTypes.STRING, allowNull: false },
    problem: { type: DataTypes.STRING },
    platform: { type: DataTypes.STRING },
    status: { 
        type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'), 
        defaultValue: 'Not Started' 
    },
    dateCompleted: { type: DataTypes.DATE }
});

module.exports = DSA;
