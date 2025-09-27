// models/Project.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Project = sequelize.define('Project', {
  type: { type: DataTypes.ENUM('Project', 'Certification'), allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  techStack: { type: DataTypes.ARRAY(DataTypes.STRING) },
  status: { type: DataTypes.ENUM('Ongoing', 'Completed'), defaultValue: 'Ongoing' },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 }, // NEW: 0 - 100
  link: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT }
}, {
  timestamps: true
});

module.exports = Project;
