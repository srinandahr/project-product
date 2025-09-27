const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all Projects
router.get('/', async (req, res) => {
    const projects = await Project.findAll();
    res.json(projects);
});

// Add Projects
router.post('/', async (req, res) => {
    const newProject = await Project.create(req.body);
    res.json(newProject);
});

// Update Project
router.put('/:id', async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (project) {
        await project.update(req.body);
        res.json(project);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

// Delete Project
router.delete('/:id', async (req, res) => {
    const project = await Project.findByPk(req.params.id);
    if (project) {
        await project.destroy();
        res.json({ message: 'Project deleted' });
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

module.exports = router;
