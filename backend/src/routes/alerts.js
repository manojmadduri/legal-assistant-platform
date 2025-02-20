const express = require('express');
const router = express.Router();
const { LegalAlert } = require('../models');
const auth = require('../middleware/auth');

// Get all alerts for a user
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await LegalAlert.findAll({
      where: { userId: req.user.id },
      order: [['dueDate', 'ASC']]
    });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new alert
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, type, priority, dueDate } = req.body;

    const alert = await LegalAlert.create({
      userId: req.user.id,
      title,
      description,
      type,
      priority,
      dueDate,
      status: 'PENDING'
    });

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an alert
router.put('/:id', auth, async (req, res) => {
  try {
    const alert = await LegalAlert.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await alert.update(req.body);
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an alert
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await LegalAlert.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await alert.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
