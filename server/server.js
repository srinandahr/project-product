const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./models/index');
const Job = require('./models/Job');
const DSA = require('./models/DSA');
const Project = require('./models/Project');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sync DB
sequelize.sync({ alter: true }).then(() => console.log('Tables synced'));

const jobRoutes = require('./routes/jobRoutes');
app.use('/api/jobs', jobRoutes);

const dsaRoutes = require('./routes/dsaRoutes');
app.use('/api/dsas', dsaRoutes);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('PERN Job Tracker API running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
