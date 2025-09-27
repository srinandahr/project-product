const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Get all jobs
router.get('/', async (req, res) => {
    const jobs = await Job.findAll();
    res.json(jobs);
});

// Add job
router.post('/', async (req, res) => {
    const newJob = await Job.create(req.body);
    res.json(newJob);
});

// Update job
router.put('/:id', async (req, res) => {
    const job = await Job.findByPk(req.params.id);
    if (job) {
        await job.update(req.body);
        res.json(job);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
});

// Delete job
router.delete('/:id', async (req, res) => {
    const job = await Job.findByPk(req.params.id);
    if (job) {
        await job.destroy();
        res.json({ message: 'Job deleted' });
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
});

module.exports = router;
