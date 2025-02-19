const express = require('express');
const router = express.Router();
const contractService = require('../services/contractService');
const { validateContract } = require('../middleware/validation');

// Get all contracts for a user
router.get('/', async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      where: { userId: req.user.uid },
      order: [['createdAt', 'DESC']],
    });
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// Get a specific contract
router.get('/:id', async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: {
        id: req.params.id,
        userId: req.user.uid,
      },
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    res.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
});

// Generate a new contract
router.post('/generate', validateContract, async (req, res) => {
  try {
    const { type, parameters } = req.body;
    const generatedContract = await contractService.generateContract(type, parameters);
    res.json(generatedContract);
  } catch (error) {
    console.error('Error generating contract:', error);
    res.status(500).json({ error: 'Failed to generate contract' });
  }
});

// Save a contract
router.post('/', validateContract, async (req, res) => {
  try {
    const contract = await contractService.saveContract(req.user.uid, req.body);
    res.status(201).json(contract);
  } catch (error) {
    console.error('Error saving contract:', error);
    res.status(500).json({ error: 'Failed to save contract' });
  }
});

// Update a contract
router.put('/:id', validateContract, async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: {
        id: req.params.id,
        userId: req.user.uid,
      },
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    const updatedContract = await contract.update(req.body);
    res.json(updatedContract);
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }
});

// Review a contract
router.post('/:id/review', async (req, res) => {
  try {
    const review = await contractService.reviewContract(req.params.id);
    res.json(review);
  } catch (error) {
    console.error('Error reviewing contract:', error);
    res.status(500).json({ error: 'Failed to review contract' });
  }
});

// Delete a contract
router.delete('/:id', async (req, res) => {
  try {
    const contract = await Contract.findOne({
      where: {
        id: req.params.id,
        userId: req.user.uid,
      },
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    await contract.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).json({ error: 'Failed to delete contract' });
  }
});

module.exports = router;
