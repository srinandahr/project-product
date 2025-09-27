const { Sequelize } = require('sequelize');

// Setup connection
const sequelize = new Sequelize('job_tracker', 'jobuser', 'jobpass', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected'))
    .catch(err => console.log('DB connection error:', err));

module.exports = sequelize;
