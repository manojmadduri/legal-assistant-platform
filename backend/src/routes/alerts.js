const express = require('express');
const router = express.Router();
const { LegalAlert } = require('../models');
const { auth } = require('../middleware/auth');
const { Queue } = require('bullmq');

const alertQueue = new Queue('legal-alerts', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

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

    // Add reminder to the queue
    await alertQueue.add('reminder', {
      alertId: alert.id,
      userId: req.user.id,
      title,
      dueDate
    }, {
      delay: new Date(dueDate).getTime() - Date.now() - (24 * 60 * 60 * 1000) // 1 day before due date
    });

    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update alert status
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const alert = await LegalAlert.findOne({
      where: { id, userId: req.user.id }
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alert.status = status;
    await alert.save();

    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an alert
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await LegalAlert.findOne({
      where: { id, userId: req.user.id }
    });

    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    await alert.destroy();
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
