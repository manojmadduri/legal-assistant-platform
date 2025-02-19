const express = require('express');
const router = express.Router();
const { Filing, Document } = require('../models');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateFiling = [
  body('filingType').isIn(['TRADEMARK', 'PATENT', 'COPYRIGHT', 'BUSINESS_REGISTRATION', 'OTHER']),
  body('jurisdiction').notEmpty(),
  body('description').optional(),
  body('dueDate').optional().isISO8601(),
  body('documentId').optional().isUUID()
];

// Get all filings for a user
router.get('/', auth, async (req, res) => {
  try {
    const filings = await Filing.findAll({
      where: { userId: req.user.id },
      include: [{ model: Document }],
      order: [['createdAt', 'DESC']]
    });
    res.json(filings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filings' });
  }
});

// Get a specific filing
router.get('/:id', auth, async (req, res) => {
  try {
    const filing = await Filing.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{ model: Document }]
    });
    
    if (!filing) {
      return res.status(404).json({ error: 'Filing not found' });
    }
    
    res.json(filing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filing' });
  }
});

// Create a new filing
router.post('/', auth, validateFiling, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filing = await Filing.create({
      ...req.body,
      userId: req.user.id,
      status: 'DRAFT'
    });

    res.status(201).json(filing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create filing' });
  }
});

// Update a filing
router.put('/:id', auth, validateFiling, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const filing = await Filing.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!filing) {
      return res.status(404).json({ error: 'Filing not found' });
    }

    await filing.update(req.body);
    res.json(filing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update filing' });
  }
});

// Delete a filing
router.delete('/:id', auth, async (req, res) => {
  try {
    const filing = await Filing.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!filing) {
      return res.status(404).json({ error: 'Filing not found' });
    }

    await filing.destroy();
    res.json({ message: 'Filing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete filing' });
  }
});

// Submit a filing
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const filing = await Filing.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!filing) {
      return res.status(404).json({ error: 'Filing not found' });
    }

    await filing.update({
      status: 'SUBMITTED',
      filingDate: new Date()
    });

    res.json(filing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit filing' });
  }
});

module.exports = router;