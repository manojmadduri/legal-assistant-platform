const express = require('express');
const router = express.Router();
const { ComplianceCheck, Document } = require('../models');
const auth = require('../middleware/auth');

// Get all compliance checks for a user
router.get('/', auth, async (req, res) => {
  try {
    const checks = await ComplianceCheck.findAll({
      where: { userId: req.user.id },
      order: [['dueDate', 'ASC']]
    });
    res.json(checks);
  } catch (error) {
    console.error('Error fetching compliance checks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new compliance check
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    // Validate required fields
    if (!title || !description || !dueDate) {
      return res.status(400).json({ 
        error: 'Title, description, and due date are required' 
      });
    }

    // Validate due date
    const dueDateObj = new Date(dueDate);
    if (isNaN(dueDateObj.getTime())) {
      return res.status(400).json({ 
        error: 'Invalid due date format' 
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dueDateObj < today) {
      return res.status(400).json({ 
        error: 'Due date cannot be in the past' 
      });
    }

    const check = await ComplianceCheck.create({
      userId: req.user.id,
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDateObj,
      status: 'PENDING',
      priority: req.body.priority || 'MEDIUM',
      assignedTo: req.body.assignedTo || req.user.id,
      category: req.body.category || 'GENERAL'
    });

    res.status(201).json(check);
  } catch (error) {
    console.error('Error creating compliance check:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Failed to create compliance check. Please try again.' 
    });
  }
});

// Update compliance check status
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'PASSED', 'FAILED'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be PENDING, PASSED, or FAILED' 
      });
    }

    const check = await ComplianceCheck.findOne({
      where: { id, userId: req.user.id }
    });

    if (!check) {
      return res.status(404).json({ error: 'Compliance check not found' });
    }

    check.status = status;
    if (status !== 'PENDING') {
      check.completedDate = new Date();
    }
    await check.save();

    res.json(check);
  } catch (error) {
    console.error('Error updating compliance check:', error);
    res.status(500).json({ 
      error: 'Failed to update compliance check. Please try again.' 
    });
  }
});

// Delete a compliance check
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const check = await ComplianceCheck.findOne({
      where: { id, userId: req.user.id }
    });

    if (!check) {
      return res.status(404).json({ error: 'Compliance check not found' });
    }

    await check.destroy();
    res.json({ message: 'Compliance check deleted successfully' });
  } catch (error) {
    console.error('Error deleting compliance check:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
