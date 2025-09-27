const express = require('express');
const router = express.Router();
const Dsa = require('../models/DSA');

// Get all dsa
router.get('/', async (req, res) => {
    const dsas = await Dsa.findAll();
    res.json(dsas);
});

// Add DSA
router.post('/', async (req, res) => {
    const newDsa = await Dsa.create(req.body);
    res.json(newDsa);
});

// Update DSA
router.put('/:id', async (req, res) => {
    const dsa = await Dsa.findByPk(req.params.id);
    if (dsa) {
        await dsa.update(req.body);
        res.json(dsa);
    } else {
        res.status(404).json({ message: 'Dsa not found' });
    }
});

// Delete DSA
router.delete('/:id', async (req, res) => {
    const dsa = await Dsa.findByPk(req.params.id);
    if (dsa) {
        await dsa.destroy();
        res.json({ message: 'Dsa deleted' });
    } else {
        res.status(404).json({ message: 'Dsa not found' });
    }
});

module.exports = router;
