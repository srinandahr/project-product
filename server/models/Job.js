const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Job = sequelize.define('Job', {
    companyName: { type: DataTypes.STRING, allowNull: false },
    jobLink: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    status: { 
        type: DataTypes.ENUM('Applied', 'Callback', 'Interviewed', 'Offer', 'Rejected'), 
        defaultValue: 'Applied'
    },
    dateApplied: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    notes: { type: DataTypes.TEXT }
});

module.exports = Job;
